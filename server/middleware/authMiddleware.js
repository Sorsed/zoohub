const pool = require("../db");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // Проверяем, есть ли активная сессия
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    if (req.session.user_type === undefined) {
      const uRes = await pool.query(
        `SELECT user_type FROM "user" WHERE user_id = $1`,
        [req.session.userId]
      );
      if (uRes.rows.length > 0) {
        req.session.user_type = Number(uRes.rows[0].user_type);
      }
    }

    // Делаем данные пользователя доступными в контроллерах
    req.user = {
      id: req.session.userId,
      name: req.session.username,
      user_type: Number(req.session.user_type || 1),
    };

    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: "Не авторизован" });
  }
};
