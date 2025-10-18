const bcrypt = require("bcrypt");
const pool = require("../db");
const uuid = require("uuid");

const ApiError = require("../error/ApiError");
const path = require("path");
class UserController {
  // Регистрация
  async registration(req, res, next) {
    try {
      const {
        user_name,
        user_surname,
        user_email,
        password,
        user_phone,
        location_id,
        user_type, // 1 — обычный пользователь, 2 — приют
        user_shelter_description,
        user_shelter_site,
        user_shelter_address,
      } = req.body;

      // 🧩 Проверяем, есть ли фото
      let fileName = null;
      if (req.files && req.files.img) {
        const { img } = req.files;
        fileName = uuid.v4() + path.extname(img.name);
        await img.mv(path.resolve(__dirname, "..", "static", fileName));
      }

      // 🛑 Базовая проверка
      if (!user_email || !password || !user_name) {
        return next(ApiError.badRequest("Обязательные поля не заполнены"));
      }

      // Проверка уникальности email
      const candidate = await pool.query(
        'SELECT * FROM "user" WHERE user_email = $1',
        [user_email]
      );
      if (candidate.rows.length > 0) {
        return next(
          ApiError.badRequest("Пользователь с таким email уже существует")
        );
      }

      //  Разделяем логику по типам
      if (Number(user_type) === 1 || Number(user_type) === 3) {
        // 👤 Обычный пользователь
        if (!user_surname) {
          return next(
            ApiError.badRequest("Фамилия обязательна для пользователя")
          );
        }
      } else if (Number(user_type) === 2) {
        // 🏠 Приют
        if (!user_shelter_address) {
          return next(ApiError.badRequest("Укажите адрес приюта"));
        }
      } else {
        return next(ApiError.badRequest("Некорректный тип пользователя"));
      }

      const hashPassword = await bcrypt.hash(password, 5);

      // 💾 Запись в базу
      const newUser = await pool.query(
        `INSERT INTO "user"
      (user_name, user_surname, user_email, user_password, user_phone, location_id,
       user_ava_photo, user_type, user_shelter_description, user_shelter_site, user_shelter_address)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,
        [
          user_name,
          user_surname || null,
          user_email,
          hashPassword,
          user_phone || null,
          location_id || null,
          fileName || null,
          Number(user_type) || 1,
          user_shelter_description || null,
          user_shelter_site || null,
          user_shelter_address || null,
        ]
      );

      const user = newUser.rows[0];

      await pool.query('INSERT INTO "favourite" (user_id) VALUES ($1)', [
        user.user_id,
      ]);

      req.session.userId = user.user_id;
      req.session.username = user.user_name;

      return res.json({ msg: "Регистрация успешна", user });
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при регистрации"));
    }
  }

  // Логин
  async login(req, res, next) {
    try {
      const { user_email, password } = req.body;

      const result = await pool.query(
        'SELECT * FROM "user" WHERE user_email = $1',
        [user_email]
      );
      const user = result.rows[0];

      if (!user) {
        return next(ApiError.internal("Пользователь с таким email не найден"));
      }

      const comparePassword = await bcrypt.compare(
        password,
        user.user_password
      );
      if (!comparePassword) {
        return next(ApiError.internal("Неверный пароль"));
      }

      // Сохраняем в сессию
      req.session.userId = user.user_id;
      req.session.username = `${user.user_name} ${user.user_surname}`;

      return res.json({ user });
    } catch (e) {
      console.error(e);
      next(ApiError.internal("Ошибка при входе"));
    }
  }

  // Проверка авторизации
  async check(req, res, next) {
    if (req.session.userId) {
      return res.json({
        loggedIn: true,
        userId: req.session.userId,
        username: req.session.username,
      });
    } else {
      return res.status(401).json({ loggedIn: false });
    }
  }

  // Логаут
  async logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        return next(ApiError.internal("Ошибка при выходе"));
      }
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        secure: false, // true если HTTPS
        sameSite: "lax",
      });
      return res.json({ msg: "Вы вышли из системы" });
    });
  }
}

module.exports = new UserController();
