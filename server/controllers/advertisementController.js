const path = require("path");
const ApiError = require("../error/ApiError");
const pool = require("../db");
const uuid = require("uuid");

class AdvertisementController {
  async create(req, res, next) {
    try {
      const {
        animal_name,
        age,
        breed,
        description,
        type_id,
        type_advertisement,
        location_name,
        tutor_name,
        tutor_number,
        tutor_email,
        is_sterilized,
        is_vaccinated,
        good_with_kids,
        good_with_animals,
      } = req.body;
      const user_id = req.user.id;

      if (!animal_name || !type_advertisement || !type_id) {
        return next(ApiError.badRequest("Не все обязательные поля заполнены"));
      }

      const isSterilized = is_sterilized === true || is_sterilized === "true" || is_sterilized === 1 || is_sterilized === "1";
      const isVaccinated = is_vaccinated === true || is_vaccinated === "true" || is_vaccinated === 1 || is_vaccinated === "1";
      const goodWithKids = good_with_kids === true || good_with_kids === "true" || good_with_kids === 1 || good_with_kids === "1";
      const goodWithAnimals = good_with_animals === true || good_with_animals === "true" || good_with_animals === 1 || good_with_animals === "1";

      //  Создаём животное
      const newAnimal = await pool.query(
        `INSERT INTO animal (animal_name, age, breed, description, type_id, is_sterilized, is_vaccinated, good_with_kids, good_with_animals)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          animal_name,
          age || null,
          breed || null,
          description || null,
          type_id,
          isSterilized,
          isVaccinated,
          goodWithKids,
          goodWithAnimals,
        ]
      );
      const animal = newAnimal.rows[0];
      console.log(animal_name);
      // 2️ Обрабатываем загруженные файлы
      if (req.files && req.files.photos) {
        const files = Array.isArray(req.files.photos)
          ? req.files.photos
          : [req.files.photos]; // поддержка одного или нескольких файлов

        const limitedFiles = files.slice(0, 10); // максимум 10

        for (const file of limitedFiles) {
          const fileName = uuid.v4() + path.extname(file.name);
          const filePath = path.resolve("static", fileName);
          await file.mv(filePath);

          await pool.query(
            `INSERT INTO animal_photos (animal_id, animal_photo_url)
           VALUES ($1, $2)`,
            [animal.animal_id, fileName]
          );
        }
      }

      const newAd = await pool.query(
        `INSERT INTO advertisement (user_id, animal_id, type_advertisement, status, location_name, tutor_name,tutor_number,tutor_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          user_id,
          animal.animal_id,
          type_advertisement,
          0,
          location_name || null,
          tutor_name || null,
          tutor_number || null,
          tutor_email || null,
        ]
      );
      const advertisement = newAd.rows[0];

      // Добавляются этапы (если есть)
      // frontend пришлёт поле stages в виде JSON-строки
      // Пример: [{ stage_name: "Прививка", stage_description: "Первая вакцина", stage_date_start: "2025-05-10", stage_date_finish: null }]
      if (req.body.stages) {
        let stages = [];

        try {
          stages = JSON.parse(req.body.stages);
          console.log(stages);
        } catch (err) {
          console.error("Ошибка парсинга stages:", err);
          return next(ApiError.badRequest("Неверный формат данных stages"));
        }

        for (const stage of stages) {
          const {
            stage_name,
            stage_description,
            stage_date_start,
            stage_date_finish,
          } = stage;

          await pool.query(
            `INSERT INTO stages (advertisement_id, stage_name, stage_description, stage_date_start, stage_date_finish)
           VALUES ($1, $2, $3, $4, $5)`,
            [
              advertisement.advertisement_id,
              stage_name || null,
              stage_description || null,
              stage_date_start || null,
              stage_date_finish || null,
            ]
          );
        }
      }

      // Успешный ответ
      res.status(201).json({
        advertisement,
        animal,
        message: "Объявление успешно создано",
      });
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при создании объявления"));
    }
  }

  // Получить все объявления
  async getAll(req, res, next) {
    try {
      const ads = await pool.query(
        `
      SELECT 
        a.advertisement_id, 
        a.type_advertisement, 
        a.status, 
        a.location_name,
        a.created_at,
        an.animal_id, 
        an.animal_name, 
        an.age, 
        an.breed, 
        an.description, 
        an.type_id,
        an.is_sterilized,
        an.is_vaccinated,
        an.good_with_kids,
        an.good_with_animals,
        u.user_id, 
        u.user_name, 
        u.user_surname,
        u.user_type,
        (
          SELECT ap.animal_photo_url 
          FROM animal_photos ap 
          WHERE ap.animal_id = an.animal_id 
          ORDER BY ap.animal_photo_id DESC 
          LIMIT 1
        ) AS preview_photo
      FROM advertisement a
      JOIN animal an ON a.animal_id = an.animal_id
      JOIN "user" u ON a.user_id = u.user_id
     
      ORDER BY a.created_at DESC
      `
      );
      res.json(ads.rows);
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при получении объявлений"));
    }
  }

  // Получить все объявления отфильтровано
  async getAllFilter(req, res, next) {
    try {
      const params = { ...(req.query || {}), ...(req.body || {}) };
      const rawTypeId = params.type_id !== undefined ? params.type_id : (params.typeId !== undefined ? params.typeId : params.type);
      const rawTypeAd = params.type_advertisement !== undefined ? params.type_advertisement : (params.typeAdvertisement !== undefined ? params.typeAdvertisement : params.category);
      const minAge = params.minAge;
      const maxAge = params.maxAge;
      const search = (params.search || params.q || "").trim();
      const city = (params.city || "").trim();
      const sortBy = params.sortBy || "newest";

      let conditions = [];
      let values = [];

      // Фильтр по виду животного
      let typeId = null;
      if (rawTypeId !== null && rawTypeId !== undefined && rawTypeId !== "" && rawTypeId !== "Все" && rawTypeId !== "null") {
        if (!isNaN(Number(rawTypeId))) {
          typeId = Number(rawTypeId);
        } else if (typeof rawTypeId === "string") {
          const lower = rawTypeId.toLowerCase();
          if (lower.includes("собак") || lower === "dogs" || lower === "dog") typeId = 1;
          else if (lower.includes("кош") || lower.includes("кот") || lower === "cats" || lower === "cat") typeId = 2;
          else if (lower.includes("птиц") || lower.includes("попуг")) typeId = 3;
          else if (lower.includes("грыз") || lower.includes("хомяк") || lower.includes("кролик")) typeId = 4;
        }
      }

      if (typeId) {
        values.push(typeId);
        conditions.push(`an.type_id = $${values.length}`);
      }

      // Фильтр по категории объявления
      let typeAdvertisement = null;
      if (rawTypeAd !== null && rawTypeAd !== undefined && rawTypeAd !== "" && rawTypeAd !== "Все" && rawTypeAd !== "null") {
        if (!isNaN(Number(rawTypeAd))) {
          typeAdvertisement = Number(rawTypeAd);
        } else if (typeof rawTypeAd === "string") {
          if (rawTypeAd.includes("дом") || rawTypeAd.includes("руки")) typeAdvertisement = 1;
          else if (rawTypeAd.includes("Потерялся") || rawTypeAd.includes("потер")) typeAdvertisement = 2;
          else if (rawTypeAd.includes("Найден") || rawTypeAd.includes("найд")) typeAdvertisement = 3;
          else if (rawTypeAd.includes("передержк")) typeAdvertisement = 4;
        }
      }

      if (typeAdvertisement) {
        values.push(typeAdvertisement);
        conditions.push(`a.type_advertisement = $${values.length}`);
      }

      // Фильтр по минимальному возрасту
      if (minAge !== null && minAge !== undefined && minAge !== "" && !isNaN(parseFloat(minAge))) {
        values.push(parseFloat(minAge));
        conditions.push(`an.age >= $${values.length}`);
      }

      // Фильтр по максимальному возрасту
      if (maxAge !== null && maxAge !== undefined && maxAge !== "" && !isNaN(parseFloat(maxAge))) {
        values.push(parseFloat(maxAge));
        conditions.push(`an.age <= $${values.length}`);
      }

      // Фильтр по городу
      if (city && city !== "Любой" && city !== "Все" && city !== "null") {
        values.push(`%${city}%`);
        conditions.push(`a.location_name ILIKE $${values.length}`);
      }

      // Фильтры быстрых тегов «Важно для дома»
      const isSterilized = params.is_sterilized !== undefined ? params.is_sterilized : params.sterilized;
      const isVaccinated = params.is_vaccinated !== undefined ? params.is_vaccinated : params.vaccinated;
      const goodWithKids = params.good_with_kids !== undefined ? params.good_with_kids : params.kids;
      const goodWithAnimals = params.good_with_animals !== undefined ? params.good_with_animals : params.animals;

      if (isSterilized === true || isSterilized === "true" || isSterilized === 1 || isSterilized === "1") {
        conditions.push("an.is_sterilized = true");
      }
      if (isVaccinated === true || isVaccinated === "true" || isVaccinated === 1 || isVaccinated === "1") {
        conditions.push("an.is_vaccinated = true");
      }
      if (goodWithKids === true || goodWithKids === "true" || goodWithKids === 1 || goodWithKids === "1") {
        conditions.push("an.good_with_kids = true");
      }
      if (goodWithAnimals === true || goodWithAnimals === "true" || goodWithAnimals === 1 || goodWithAnimals === "1") {
        conditions.push("an.good_with_animals = true");
      }

      // Текстовый поиск по кличке, породе и описанию
      if (search) {
        values.push(`%${search}%`);
        conditions.push(`
          (an.animal_name ILIKE $${values.length} 
          OR an.breed ILIKE $${values.length} 
          OR an.description ILIKE $${values.length})
        `);
      }

      let whereClause = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

      // Сортировка
      let orderClause = "ORDER BY a.created_at DESC";
      if (sortBy === "oldest") {
        orderClause = "ORDER BY a.created_at ASC";
      } else if (sortBy === "age_asc") {
        orderClause = "ORDER BY an.age ASC NULLS LAST";
      } else if (sortBy === "age_desc") {
        orderClause = "ORDER BY an.age DESC NULLS LAST";
      }

      const ads = await pool.query(
        `
        SELECT 
          a.advertisement_id, 
          a.type_advertisement, 
          a.status, 
          a.location_name,
          a.created_at,
          an.animal_id, 
          an.animal_name, 
          an.age, 
          an.breed, 
          an.description, 
          an.type_id,
          an.is_sterilized,
          an.is_vaccinated,
          an.good_with_kids,
          an.good_with_animals,
          u.user_id, 
          u.user_name, 
          u.user_surname,
          u.user_type,
          (
            SELECT ap.animal_photo_url 
            FROM animal_photos ap 
            WHERE ap.animal_id = an.animal_id 
            ORDER BY ap.animal_photo_id DESC 
            LIMIT 1
          ) AS preview_photo
        FROM advertisement a
        JOIN animal an ON a.animal_id = an.animal_id
        JOIN "user" u ON a.user_id = u.user_id
        ${whereClause}
        ${orderClause}
        `,
        values
      );

      res.json(ads.rows);
    } catch (e) {
      console.error("Ошибка в getAllFilter:", e);
      next(ApiError.internal("Ошибка при получении объявлений"));
    }
  }

  async getmyAds(req, res, next) {
    try {
      const user_id = req.user.id;

      const ads = await pool.query(
        `
      SELECT 
        a.advertisement_id, 
        a.type_advertisement, 
        a.status, 
        a.created_at,
        an.animal_id, 
        an.animal_name, 
        an.age, 
        an.breed, 
        an.description, 
        an.type_id,
        an.is_sterilized,
        an.is_vaccinated,
        an.good_with_kids,
        an.good_with_animals,
        u.user_id, 
        u.user_name, 
        u.user_surname,
        u.user_type,
        (
          SELECT ap.animal_photo_url 
          FROM animal_photos ap 
          WHERE ap.animal_id = an.animal_id 
          ORDER BY ap.animal_photo_id DESC 
          LIMIT 1
        ) AS preview_photo
      FROM advertisement a
      JOIN animal an ON a.animal_id = an.animal_id
      JOIN "user" u ON a.user_id = u.user_id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
      `,
        [user_id]
      );

      res.json(ads.rows);
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при получении объявлений"));
    }
  }

  // Получить одно объявление по ID
  // Получить одно объявление по ID
  async getOne(req, res, next) {
    try {
      const { id } = req.params;

      // Получаем объявление
      const adQuery = await pool.query(
        `SELECT 
        a.advertisement_id,
        a.type_advertisement,
        a.status,
        a.created_at,
        a.tutor_email,
        a.tutor_number,
        a.tutor_name,
        an.animal_id,
        an.animal_name,
        an.age,
        an.breed,
        an.description,
        an.type_id,
        an.is_sterilized,
        an.is_vaccinated,
        an.good_with_kids,
        an.good_with_animals,
        u.user_id,
        u.user_name,
        u.user_surname,
        u.user_phone,
        u.user_ava_photo,
        u.user_type,
        l.location_name
      FROM advertisement a
      JOIN animal an ON a.animal_id = an.animal_id
      JOIN "user" u ON a.user_id = u.user_id
      LEFT JOIN location l ON u.location_id = l.location_id
      WHERE a.advertisement_id = $1`,
        [id]
      );

      if (adQuery.rows.length === 0) {
        return next(ApiError.badRequest("Объявление не найдено"));
      }

      const ad = adQuery.rows[0];

      // Получаем фото
      const photosQuery = await pool.query(
        `SELECT animal_photo_url 
       FROM animal_photos 
       WHERE animal_id = $1 
       ORDER BY animal_photo_id DESC`,
        [ad.animal_id]
      );
      const photos = photosQuery.rows.map((p) => p.animal_photo_url);

      // Получаем этапы / события (только для приютов)
      let stages = [];
      if (ad.user_type === 2) {
        const stagesQuery = await pool.query(
          `SELECT stage_name, stage_description, stage_date_start, stage_date_finish
         FROM stages
         WHERE advertisement_id = $1
         ORDER BY stage_date_start ASC`,
          [ad.advertisement_id]
        );
        stages = stagesQuery.rows;
      }

      res.json({
        ...ad,
        photos,
        stages, // добавляем этапы в ответ
      });
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при получении объявления"));
    }
  }

  async changeAds(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) return next(ApiError.badRequest("Не указан id объявления"));

      const {
        animal_name,
        breed,
        age,
        description,
        location_name,
        existing_photos,
        tutor_name,
        tutor_number,
        tutor_email,
        type_advertisement,
        is_sterilized,
        is_vaccinated,
        good_with_kids,
        good_with_animals,
      } = req.body;
      console.log(tutor_name);
      const files = req.files?.photos
        ? Array.isArray(req.files.photos)
          ? req.files.photos
          : [req.files.photos]
        : [];

      // Получаем объявление и проверяем существование
      const adQuery = await pool.query(
        `SELECT user_id, animal_id FROM advertisement WHERE advertisement_id = $1`,
        [id]
      );
      if (!adQuery.rows.length)
        return next(ApiError.badRequest("Объявление не найдено"));
      const ad = adQuery.rows[0];
      const animal_id = ad.animal_id;

      // Права на редактирование: автор ИЛИ модератор (user_type === 4)
      const isOwner = Number(ad.user_id) === Number(req.user?.id);
      const isModerator = Number(req.user?.user_type) === 4;
      if (!isOwner && !isModerator) {
        return res
          .status(403)
          .json({ message: "Нет прав на редактирование этого объявления" });
      }

      // Преобразование булевых значений
      const isSterilized = is_sterilized !== undefined ? (is_sterilized === true || is_sterilized === "true" || is_sterilized === 1 || is_sterilized === "1") : null;
      const isVaccinated = is_vaccinated !== undefined ? (is_vaccinated === true || is_vaccinated === "true" || is_vaccinated === 1 || is_vaccinated === "1") : null;
      const goodWithKids = good_with_kids !== undefined ? (good_with_kids === true || good_with_kids === "true" || good_with_kids === 1 || good_with_kids === "1") : null;
      const goodWithAnimals = good_with_animals !== undefined ? (good_with_animals === true || good_with_animals === "true" || good_with_animals === 1 || good_with_animals === "1") : null;

      // Обновляем животное
      await pool.query(
        `UPDATE animal 
         SET animal_name=$1, breed=$2, age=$3, description=$4,
             is_sterilized=COALESCE($5, is_sterilized),
             is_vaccinated=COALESCE($6, is_vaccinated),
             good_with_kids=COALESCE($7, good_with_kids),
             good_with_animals=COALESCE($8, good_with_animals)
         WHERE animal_id=$9`,
        [
          animal_name,
          breed,
          age || null,
          description || null,
          isSterilized,
          isVaccinated,
          goodWithKids,
          goodWithAnimals,
          animal_id,
        ]
      );

      await pool.query(
        `UPDATE advertisement 
         SET tutor_name=$1, tutor_number=$2, tutor_email=$3, 
             type_advertisement=COALESCE($4, type_advertisement),
             location_name=COALESCE($5, location_name)
         WHERE advertisement_id = $6`,
        [
          tutor_name || null,
          tutor_number || null,
          tutor_email || null,
          type_advertisement ? parseInt(type_advertisement) : null,
          location_name || null,
          id,
        ]
      );

      // Обновляем местоположение (если указано)
      if (location_name) {
        await pool.query(
          `UPDATE "user"
         SET location_id = (SELECT location_id FROM location WHERE location_name = $1)
         WHERE user_id = (SELECT user_id FROM advertisement WHERE advertisement_id = $2)`,
          [location_name, id]
        );
      }

      const remainingPhotos = existing_photos
        ? JSON.parse(existing_photos)
        : [];

      await pool.query(`DELETE FROM animal_photos WHERE animal_id=$1`, [
        animal_id,
      ]);

      for (const photoName of remainingPhotos) {
        await pool.query(
          `INSERT INTO animal_photos (animal_id, animal_photo_url) VALUES ($1, $2)`,
          [animal_id, photoName]
        );
      }

      for (const file of files) {
        const fileName = uuid.v4() + path.extname(file.name);
        const filePath = path.resolve("static", fileName);
        await file.mv(filePath);
        await pool.query(
          `INSERT INTO animal_photos (animal_id, animal_photo_url) VALUES ($1, $2)`,
          [animal_id, fileName]
        );
      }
      if (req.body.stages) {
        let stages = [];
        try {
          stages = JSON.parse(req.body.stages); // stages приходит как JSON-строка из FormData
        } catch (err) {
          console.error("Ошибка парсинга stages:", err);
          return next(ApiError.badRequest("Неверный формат данных stages"));
        }

        // Сначала удаляем старые этапы для этого объявления
        await pool.query(`DELETE FROM stages WHERE advertisement_id=$1`, [id]);

        // Вставляем новые/обновленные этапы
        for (const stage of stages) {
          const {
            stage_name,
            stage_description,
            stage_date_start,
            stage_date_finish,
          } = stage;

          await pool.query(
            `INSERT INTO stages (advertisement_id, stage_name, stage_description, stage_date_start, stage_date_finish)
       VALUES ($1, $2, $3, $4, $5)`,
            [
              id,
              stage_name || null,
              stage_description || null,
              stage_date_start || null,
              stage_date_finish || null,
            ]
          );
        }
      }
      res.json({ message: "Объявление успешно обновлено" });
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при обновлении объявления"));
    }
  }

  async deleteAds(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Проверяем существование объявления
      const adResult = await pool.query(
        "SELECT * FROM advertisement WHERE advertisement_id = $1",
        [id]
      );

      if (adResult.rows.length === 0) {
        return res.status(404).json({ message: "Объявление не найдено" });
      }

      const ad = adResult.rows[0];

      // Проверяем права пользователя: автор ИЛИ модератор (user_type === 4)
      const isOwner = Number(ad.user_id) === Number(userId);
      const isModerator = Number(req.user?.user_type) === 4;
      if (!isOwner && !isModerator) {
        return res
          .status(403)
          .json({ message: "Нет прав на удаление этого объявления" });
      }

      // Удаляем связанные фотографии
      await pool.query("DELETE FROM animal_photos WHERE animal_id = $1", [
        ad.animal_id,
      ]);

      // Удаляем связанные этапы/события
      await pool.query("DELETE FROM stages WHERE advertisement_id = $1", [id]);

      // Удаляем объявление и животное
      await pool.query(
        "DELETE FROM advertisement WHERE advertisement_id = $1",
        [id]
      );
      await pool.query("DELETE FROM animal WHERE animal_id = $1", [
        ad.animal_id,
      ]);

      return res.json({ message: "Объявление успешно удалено" });
    } catch (error) {
      console.error(error);
      next(ApiError.internal("Ошибка при удалении объявления"));
    }
  }

  async getByUserId(req, res, next) {
    try {
      const { id } = req.params;

      const ads = await pool.query(
        `    SELECT 
        a.advertisement_id, 
        a.type_advertisement, 
        a.status, 
        a.created_at,
        an.animal_id, 
        an.animal_name, 
        an.age, 
        an.breed, 
        an.description, 
        an.type_id,
        u.user_id, 
    
        (
          SELECT ap.animal_photo_url 
          FROM animal_photos ap 
          WHERE ap.animal_id = an.animal_id 
          ORDER BY ap.animal_photo_id DESC 
          LIMIT 1
        ) AS preview_photo
      FROM advertisement a
      JOIN animal an ON a.animal_id = an.animal_id
      JOIN "user" u ON a.user_id = u.user_id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
      `,
        [id]
      );

      return res.json(ads.rows);
    } catch (e) {
      console.error("Ошибка при получении объявлений пользователя:", e);
      return next(
        ApiError.internal("Ошибка при получении объявлений пользователя")
      );
    }
  }

  // Получить все объявления для панели модератора (user_type === 4)
  async getModerationAll(req, res, next) {
    try {
      const isModerator = Number(req.user?.user_type) === 4;
      if (!isModerator) {
        return res
          .status(403)
          .json({ message: "Доступ запрещен. Требуются права модератора" });
      }

      const ads = await pool.query(
        `
        SELECT 
          a.advertisement_id, 
          a.type_advertisement, 
          a.status, 
          a.location_name,
          a.created_at,
          a.tutor_name,
          a.tutor_number,
          a.tutor_email,
          an.animal_id, 
          an.animal_name, 
          an.age, 
          an.breed, 
          an.description, 
          an.type_id,
          an.is_sterilized,
          an.is_vaccinated,
          an.good_with_kids,
          an.good_with_animals,
          u.user_id, 
          u.user_name, 
          u.user_surname,
          u.user_email,
          u.user_phone,
          u.user_type,
          (
            SELECT ap.animal_photo_url 
            FROM animal_photos ap 
            WHERE ap.animal_id = an.animal_id 
            ORDER BY ap.animal_photo_id DESC 
            LIMIT 1
          ) AS preview_photo
        FROM advertisement a
        JOIN animal an ON a.animal_id = an.animal_id
        JOIN "user" u ON a.user_id = u.user_id
        ORDER BY a.created_at DESC
        `
      );

      return res.json(ads.rows);
    } catch (e) {
      console.error("Ошибка при получении объявлений для модерации:", e);
      return next(ApiError.internal("Ошибка при получении объявлений"));
    }
  }
}

module.exports = new AdvertisementController();
