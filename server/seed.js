const bcrypt = require("bcrypt");
const pool = require("./db");

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Locations
    await pool.query(`
      INSERT INTO location (location_id, location_name)
      VALUES 
        (1, 'Самара'),
        (2, 'Москва'),
        (3, 'Санкт-Петербург'),
        (4, 'Казань')
      ON CONFLICT (location_id) DO UPDATE SET location_name = EXCLUDED.location_name;
    `);
    console.log("✅ Locations verified");

    // 2. Animal types
    await pool.query(`
      INSERT INTO animal_type (type_id, type_name)
      VALUES 
        (1, 'Собака'),
        (2, 'Кошка'),
        (3, 'Попугай'),
        (4, 'Хомяк'),
        (5, 'Кролик'),
        (6, 'Черепаха'),
        (7, 'Лошадь'),
        (8, 'Рыбка'),
        (9, 'Игуана'),
        (10, 'Другое'),
        (11, 'Птица'),
        (12, 'Грызун')
      ON CONFLICT (type_id) DO UPDATE SET type_name = EXCLUDED.type_name;
      SELECT setval('animal_type_type_id_seq', (SELECT MAX(type_id) FROM animal_type));
    `);
    console.log("✅ Animal types verified");

    // Default password hash
    const passwordHash = await bcrypt.hash("123456", 5);

    // 3. Shelters (user_type = 2)
    const shelter1 = await pool.query(
      `
      INSERT INTO "user" (
        user_name, user_surname, user_email, user_password, user_phone, 
        location_id, user_ava_photo, user_type, user_shelter_description, 
        user_shelter_site, user_shelter_address, shelter_latitude, shelter_longitude
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (user_email) DO UPDATE SET
        user_name = EXCLUDED.user_name,
        user_phone = EXCLUDED.user_phone,
        user_type = EXCLUDED.user_type,
        user_shelter_description = EXCLUDED.user_shelter_description,
        user_shelter_site = EXCLUDED.user_shelter_site,
        user_shelter_address = EXCLUDED.user_shelter_address,
        shelter_latitude = EXCLUDED.shelter_latitude,
        shelter_longitude = EXCLUDED.shelter_longitude,
        user_ava_photo = EXCLUDED.user_ava_photo
      RETURNING user_id;
    `,
      [
        "Приют «Надежда»",
        "",
        "nadezhda@zoohub.ru",
        passwordHash,
        "+7 (846) 205-15-15",
        1,
        "story-1.jpg",
        2,
        "Городской благотворительный приют для бездомных животных. Мы заботимся о собаках и кошках, лечим, стерилизуем и находим ответственных хозяев. За 8 лет работы более 2000 животных обрели любящие семьи.",
        "https://nadezhda63.ru",
        "Самара, ул. Авроры, 114а",
        53.1959,
        50.18,
      ]
    );
    const shelter1Id = shelter1.rows[0].user_id;

    const shelter2 = await pool.query(
      `
      INSERT INTO "user" (
        user_name, user_surname, user_email, user_password, user_phone, 
        location_id, user_ava_photo, user_type, user_shelter_description, 
        user_shelter_site, user_shelter_address, shelter_latitude, shelter_longitude
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (user_email) DO UPDATE SET
        user_name = EXCLUDED.user_name,
        user_phone = EXCLUDED.user_phone,
        user_type = EXCLUDED.user_type,
        user_shelter_description = EXCLUDED.user_shelter_description,
        user_shelter_site = EXCLUDED.user_shelter_site,
        user_shelter_address = EXCLUDED.user_shelter_address,
        shelter_latitude = EXCLUDED.shelter_latitude,
        shelter_longitude = EXCLUDED.shelter_longitude,
        user_ava_photo = EXCLUDED.user_ava_photo
      RETURNING user_id;
    `,
      [
        "Центр помощи «Хатико»",
        "",
        "hatiko@zoohub.ru",
        passwordHash,
        "+7 (846) 990-44-33",
        1,
        "story-2.jpg",
        2,
        "Реабилитационный центр помощи попавшим в беду животным. Оказываем ветеринарную помощь, социализацию, кинологические тренировки и адаптацию перед передачей в семью.",
        "https://hatiko63.ru",
        "Самара, Московское шоссе, 18-й км",
        53.2845,
        50.2789,
      ]
    );
    const shelter2Id = shelter2.rows[0].user_id;

    // 4. Volunteers (user_type = 3)
    const vol1 = await pool.query(
      `
      INSERT INTO "user" (
        user_name, user_surname, user_email, user_password, user_phone, 
        location_id, user_ava_photo, user_type, user_shelter_description
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (user_email) DO UPDATE SET
        user_name = EXCLUDED.user_name,
        user_surname = EXCLUDED.user_surname,
        user_phone = EXCLUDED.user_phone,
        user_type = EXCLUDED.user_type,
        user_shelter_description = EXCLUDED.user_shelter_description,
        user_ava_photo = EXCLUDED.user_ava_photo
      RETURNING user_id;
    `,
      [
        "Анна",
        "Смирнова",
        "anna.volunteer@zoohub.ru",
        passwordHash,
        "+7 (927) 700-11-22",
        1,
        "5d79be0d-b6c0-45b9-9e6e-475d8d754551.jpg",
        3,
        "Автоволонтёр и куратор собак в Самаре. Помогаю с перевозкой в ветеринарные клиники, поиском пропавших питомцев и временной передержкой.",
      ]
    );
    const vol1Id = vol1.rows[0].user_id;

    const vol2 = await pool.query(
      `
      INSERT INTO "user" (
        user_name, user_surname, user_email, user_password, user_phone, 
        location_id, user_ava_photo, user_type, user_shelter_description
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (user_email) DO UPDATE SET
        user_name = EXCLUDED.user_name,
        user_surname = EXCLUDED.user_surname,
        user_phone = EXCLUDED.user_phone,
        user_type = EXCLUDED.user_type,
        user_shelter_description = EXCLUDED.user_shelter_description,
        user_ava_photo = EXCLUDED.user_ava_photo
      RETURNING user_id;
    `,
      [
        "Дмитрий",
        "Кузнецов",
        "dmitry.volunteer@zoohub.ru",
        passwordHash,
        "+7 (937) 800-33-44",
        1,
        "29448a73-9c54-4abc-9090-46682c88e08f.jpg",
        3,
        "Организую передержки кошек и котят, помогаю со стерилизацией, вакцинацией и социализацией. Опыт в зооволонтёрстве более 5 лет.",
      ]
    );
    const vol2Id = vol2.rows[0].user_id;

    const vol3 = await pool.query(
      `
      INSERT INTO "user" (
        user_name, user_surname, user_email, user_password, user_phone, 
        location_id, user_ava_photo, user_type, user_shelter_description
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (user_email) DO UPDATE SET
        user_name = EXCLUDED.user_name,
        user_surname = EXCLUDED.user_surname,
        user_phone = EXCLUDED.user_phone,
        user_type = EXCLUDED.user_type,
        user_shelter_description = EXCLUDED.user_shelter_description,
        user_ava_photo = EXCLUDED.user_ava_photo
      RETURNING user_id;
    `,
      [
        "Елена",
        "Васильева",
        "elena.volunteer@zoohub.ru",
        passwordHash,
        "+7 (917) 600-55-66",
        1,
        "76828b0d-3556-4456-a3f8-2f9f7b9addd1.jpg",
        3,
        "Фотопомощь для приютов, ведение соцсетей, поиск любящих семей для животных с особенностями здоровья и пожилых питомцев.",
      ]
    );
    const vol3Id = vol3.rows[0].user_id;

    // 5. Regular User (user_type = 1)
    const user1 = await pool.query(
      `
      INSERT INTO "user" (
        user_name, user_surname, user_email, user_password, user_phone, 
        location_id, user_ava_photo, user_type
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (user_email) DO UPDATE SET
        user_name = EXCLUDED.user_name,
        user_surname = EXCLUDED.user_surname,
        user_phone = EXCLUDED.user_phone,
        user_type = EXCLUDED.user_type
      RETURNING user_id;
    `,
      [
        "Михаил",
        "Петров",
        "mikhail@zoohub.ru",
        passwordHash,
        "+7 (927) 333-22-11",
        1,
        "37710ea3-bb24-4f16-92cd-90704b6132e4.jpg",
        1,
      ]
    );
    const user1Id = user1.rows[0].user_id;

    // 6. Moderator / Admin (user_type = 4)
    const modUser = await pool.query(
      `
      INSERT INTO "user" (
        user_name, user_surname, user_email, user_password, user_phone, 
        location_id, user_type
      ) VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (user_email) DO UPDATE SET
        user_name = EXCLUDED.user_name,
        user_surname = EXCLUDED.user_surname,
        user_phone = EXCLUDED.user_phone,
        user_type = EXCLUDED.user_type
      RETURNING user_id;
    `,
      [
        "Алексей",
        "Модератор",
        "admin@zoohub.ru",
        passwordHash,
        "+7 (999) 000-00-01",
        1,
        4,
      ]
    );
    const modUserId = modUser.rows[0].user_id;

    // Ensure favorite entries exist for all users
    const allUserIds = [
      shelter1Id,
      shelter2Id,
      vol1Id,
      vol2Id,
      vol3Id,
      user1Id,
      modUserId,
    ];
    for (const uId of allUserIds) {
      await pool.query(
        `INSERT INTO favourite (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
        [uId]
      );
    }

    console.log("✅ Users seeded (shelters, volunteers, user)");

    // 6. Pet Ads
    const demoAds = [
      {
        userId: shelter1Id,
        animalName: "Барсик",
        typeId: 2, // Кошка
        breed: "Шотландская вислоухая (метис)",
        age: 2,
        desc: "Спокойный, ласковый и воспитанный кот. Любит сидеть рядом и мурлыкать. Приучен к лотку и когтеточке, кастрирован, обработан от паразитов. Ищет заботливую семью.",
        category: 1, // Ищет дом
        location: "Самара",
        tutorName: "Приют «Надежда»",
        tutorPhone: "+7 (846) 205-15-15",
        tutorEmail: "nadezhda@zoohub.ru",
        photos: ["hero-pets.jpg", "story-1.jpg"],
        stages: [
          {
            name: "Осмотр и карантин",
            desc: "Первичный ветеринарный осмотр, сдача анализов",
            start: "2026-09-01",
            finish: "2026-09-15",
          },
          {
            name: "Вакцинация и паспорт",
            desc: "Комплексная прививка и оформление ветеринарного паспорта",
            start: "2026-09-20",
            finish: "2026-09-20",
          },
          {
            name: "Готов к семье",
            desc: "Полностью здоров, социализирован и ждет хозяев",
            start: "2026-10-01",
            finish: null,
          },
        ],
      },
      {
        userId: shelter2Id,
        animalName: "Рекс",
        typeId: 1, // Собака
        breed: "Немецкая овчарка (метис)",
        age: 3,
        desc: "Преданный, умный и энергичный пёс. Знает базовые команды ('сидеть', 'лапу', 'рядом'). Прекрасно ходит на поводке, дружелюбен к людям. Отлично подойдёт для жизни в частном доме или просторной квартире.",
        category: 1, // Ищет дом
        location: "Самара",
        tutorName: "Центр помощи «Хатико»",
        tutorPhone: "+7 (846) 990-44-33",
        tutorEmail: "hatiko@zoohub.ru",
        photos: ["heropet.jpeg", "4d66105e-7dcc-4422-88d9-414e826d4ab5.jpg"],
        stages: [
          {
            name: "Поступление в центр",
            desc: "Спасён с улицы, проведён курс восстановления",
            start: "2026-08-10",
            finish: "2026-08-25",
          },
          {
            name: "Занятия с кинологом",
            desc: "Обучение базовым командам и социализация",
            start: "2026-09-01",
            finish: "2026-09-30",
          },
        ],
      },
      {
        userId: vol1Id,
        animalName: "Луна",
        typeId: 2, // Кошка
        breed: "Европейская короткошерстная",
        age: 1,
        desc: "Нежная и игривая кошечка с выразительными изумрудными глазами. Очень ориентирована на человека, обожает ласку и внимание. Здорова, стерилизована, привита.",
        category: 1, // Ищет дом
        location: "Самара",
        tutorName: "Анна Смирнова",
        tutorPhone: "+7 (927) 700-11-22",
        tutorEmail: "anna.volunteer@zoohub.ru",
        photos: [
          "033d72e8-cb95-4362-8eae-df5e8ceca5fe.jpg",
          "091ced40-283b-48fe-a374-aed46a26cc3c.jpg",
        ],
        stages: [
          {
            name: "Стерилизация и прививки",
            desc: "Проведена плановая стерилизация, сделана комплексная вакцина",
            start: "2026-09-10",
            finish: "2026-09-10",
          },
        ],
      },
      {
        userId: user1Id,
        animalName: "Бим",
        typeId: 1, // Собака
        breed: "Золотистый ретривер",
        age: 4,
        desc: "ВНИМАНИЕ! 15 октября в районе парка им. Гагарина (пересечение ул. Советской Армии и Стара-Загора) пропала собака! Кобель, откликается на кличку Бим. Был в коричневом кожаном ошейнике. Очень дружелюбный, нашедшему или видевшему просьба срочно позвонить!",
        category: 2, // Потерялся
        location: "Самара",
        tutorName: "Михаил Петров",
        tutorPhone: "+7 (927) 333-22-11",
        tutorEmail: "mikhail@zoohub.ru",
        photos: ["1c536ced-478c-4e45-add6-798eeaef2c82.jpg"],
        stages: [],
      },
      {
        userId: vol2Id,
        animalName: "Муся",
        typeId: 2, // Кошка
        breed: "Трехцветная кошечка",
        age: 0.5,
        desc: "НАЙДЕНА КОШКА! 17 октября в подъезде дома по ул. Победы, 102. Молоденькая трёхцветная кошечка, очень чистая, домашняя, ласковая. Ищем старых хозяев или временную передержку!",
        category: 3, // Найден
        location: "Самара",
        tutorName: "Дмитрий Кузнецов",
        tutorPhone: "+7 (937) 800-33-44",
        tutorEmail: "dmitry.volunteer@zoohub.ru",
        photos: ["05840302-0e4a-43b8-ba18-ad83fdb21ac3.jpg"],
        stages: [],
      },
      {
        userId: vol3Id,
        animalName: "Майло",
        typeId: 1, // Собака
        breed: "Джек-рассел терьер (метис)",
        age: 1.5,
        desc: "СРОЧНО НУЖНА ПЕРЕДЕРЖКА на 2 недели (с 25 октября по 8 ноября). Хозяин экстренно госпитализирован. Пёсик очень добрый, чистоплотный, выгул 2 раза в день. Всем кормом и амуницией обеспечим полностью!",
        category: 4, // Нужна передержка
        location: "Самара",
        tutorName: "Елена Васильева",
        tutorPhone: "+7 (917) 600-55-66",
        tutorEmail: "elena.volunteer@zoohub.ru",
        photos: ["302c9187-2f6f-47ea-98ad-e11338fff4c3.jpg"],
        stages: [],
      },
      {
        userId: vol2Id,
        animalName: "Персик",
        typeId: 2, // Кошка
        breed: "Рыжий пушистый кот",
        age: 0.8,
        desc: "Невероятно солнечный и ласковый рыжий котейка Персик. Мурлычет как трактор, обожает сидеть на ручках и играть с дразнилками. Кастрирован, приучен к лотку.",
        category: 1, // Ищет дом
        location: "Самара",
        tutorName: "Дмитрий Кузнецов",
        tutorPhone: "+7 (937) 800-33-44",
        tutorEmail: "dmitry.volunteer@zoohub.ru",
        photos: [
          "11565f94-c4c0-4e3e-81a9-7fb2d3ff4866.jpg",
          "24be0be0-18e8-4387-94b3-4ced4c902154.jpg",
        ],
        stages: [],
      },
      {
        userId: shelter2Id,
        animalName: "Граф",
        typeId: 1, // Собака
        breed: "Сибирский хаски",
        age: 2,
        desc: "Граф — благородный хаски с разноцветными глазами. Активный, обожает долгие прогулки и пробежки. Отдаётся взрослым ответственным людям, знающим особенности породы.",
        category: 1, // Ищет дом
        location: "Самара",
        tutorName: "Центр помощи «Хатико»",
        tutorPhone: "+7 (846) 990-44-33",
        tutorEmail: "hatiko@zoohub.ru",
        photos: [
          "4bd161db-b706-4bdf-923e-8a9193244ee2.jpg",
          "4d66105e-7dcc-4422-88d9-414e826d4ab5.jpg",
        ],
        stages: [
          {
            name: "Ветеринарный осмотр",
            desc: "Чипирован, привит против бешенства и инфекций",
            start: "2026-09-05",
            finish: "2026-09-05",
          },
        ],
      },
    ];

    // Clear existing animal / ads if any duplicate seeding
    await pool.query(
      `DELETE FROM stages WHERE advertisement_id IN (SELECT advertisement_id FROM advertisement)`
    );
    await pool.query(
      `DELETE FROM favourite_advertisement WHERE advertisement_id IN (SELECT advertisement_id FROM advertisement)`
    );
    await pool.query(
      `DELETE FROM animal_photos WHERE animal_id IN (SELECT animal_id FROM animal)`
    );
    await pool.query(`DELETE FROM advertisement`);
    await pool.query(`DELETE FROM animal`);

    for (const item of demoAds) {
      // 1. Insert animal
      const animalRes = await pool.query(
        `INSERT INTO animal (animal_name, age, breed, description, type_id, is_sterilized, is_vaccinated, good_with_kids, good_with_animals)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING animal_id`,
        [
          item.animalName,
          item.age,
          item.breed,
          item.desc,
          item.typeId,
          item.isSterilized !== undefined ? item.isSterilized : true,
          item.isVaccinated !== undefined ? item.isVaccinated : true,
          item.goodWithKids !== undefined ? item.goodWithKids : true,
          item.goodWithAnimals !== undefined ? item.goodWithAnimals : true,
        ]
      );
      const animalId = animalRes.rows[0].animal_id;

      // 2. Insert photos
      for (const photo of item.photos) {
        await pool.query(
          `INSERT INTO animal_photos (animal_id, animal_photo_url)
           VALUES ($1, $2)`,
          [animalId, photo]
        );
      }

      // 3. Insert advertisement
      const adRes = await pool.query(
        `INSERT INTO advertisement (
           user_id, animal_id, type_advertisement, status, location_name, 
           tutor_name, tutor_number, tutor_email
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING advertisement_id`,
        [
          item.userId,
          animalId,
          item.category,
          0,
          item.location,
          item.tutorName,
          item.tutorPhone,
          item.tutorEmail,
        ]
      );
      const adId = adRes.rows[0].advertisement_id;

      // 4. Insert stages if any
      for (const st of item.stages) {
        await pool.query(
          `INSERT INTO stages (advertisement_id, stage_name, stage_description, stage_date_start, stage_date_finish)
           VALUES ($1, $2, $3, $4, $5)`,
          [adId, st.name, st.desc, st.start, st.finish]
        );
      }
    }

    console.log(`✅ Successfully seeded ${demoAds.length} pet advertisements!`);
    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
