// controllers/profileController.js
const pool = require("../db");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const path = require("path");
const uuid = require("uuid");
class ProfileController {
  // Изменение профиля: одно или несколько полей
  async change(req, res, next) {
    try {
      const user_id = req.user.id;
      const {
        user_name,
        user_surname,
        user_email,
        user_phone,
        location_id,
        user_type,
        user_shelter_description,
        user_shelter_site,
        user_shelter_address,
      } = req.body;
      console.log(location_id);
      console.log(user_type);
      // --- 1️⃣ Обновляем текстовые поля ---
      const updateUser = await pool.query(
        `
        UPDATE "user"
        SET 
          user_name = $1,
          user_surname = $2,
          user_email = $3,
          user_phone = $4,
          location_id = $5,
          user_type = $6,
          user_shelter_description = $7,
          user_shelter_site = $8,
          user_shelter_address = $9
        WHERE user_id = $10
        RETURNING *;
      `,
        [
          user_name,
          user_surname,
          user_email,
          user_phone || null,
          location_id || null,
          user_type || 1,
          user_shelter_description || null,
          user_shelter_site || null,
          user_shelter_address || null,
          user_id,
        ]
      );

      let userData = updateUser.rows[0];

      // --- 2️⃣ Если пришло изображение — сохраняем отдельно ---
      if (req.files && req.files.img) {
        const { img } = req.files;
        const fileName = uuid.v4() + path.extname(img.name);
        await img.mv(path.resolve(__dirname, "..", "static", fileName));

        const avatarUpdate = await pool.query(
          `
          UPDATE "user" 
          SET user_ava_photo = $1 
          WHERE user_id = $2 
          RETURNING *;
        `,
          [fileName, user_id]
        );

        userData = avatarUpdate.rows[0];
      }

      return res.json({ msg: "Профиль успешно обновлён", user: userData });
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при обновлении профиля"));
    }
  }

  // Получить данные текущего пользователя
  async getMy(req, res, next) {
    try {
      const user_id = req.user.id;

      const result = await pool.query(
        `SELECT 
         u.user_id,
         u.user_name,
         u.user_surname,
         u.user_email,
         u.user_phone,
         u.user_ava_photo,
         u.location_id,
         u.user_type,
         u.user_shelter_description,
         u.user_shelter_site,
         u.user_shelter_address,
         COALESCE(l.location_name, 'Самара') AS location_name
       FROM "user" u
       LEFT JOIN location l ON u.location_id = l.location_id
       WHERE u.user_id=$1`,
        [user_id]
      );

      if (!result.rows[0]) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      res.json(result.rows[0]);
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при получении данных"));
    }
  }

  // Получить данные другого пользователя по id
  async getOther(req, res, next) {
    try {
      const user_id = req.params.id;
      const result = await pool.query(
        `SELECT user_id, user_name, user_surname, user_email, user_phone, user_ava_photo, location_id,user_shelter_description,user_shelter_site,user_shelter_address,user_type
         FROM "user"
         WHERE user_id=$1`,
        [user_id]
      );

      if (result.rows.length === 0) {
        return next(ApiError.badRequest("Пользователь не найден"));
      }

      res.json(result.rows[0]);
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при получении данных"));
    }
  }
}

module.exports = new ProfileController();
