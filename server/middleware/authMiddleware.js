module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // Проверяем, есть ли активная сессия
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Не авторизован ты" });
    }

    // Делаем данные пользователя доступными в контроллерах
    req.user = {
      id: req.session.userId,
      name: req.session.username,
    };

    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: "Не авторизован" });
  }
};
