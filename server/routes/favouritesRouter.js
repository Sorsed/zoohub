const Router = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const favouritesController = require("../controllers/favouritesController");

const router = new Router();

// Получить все избранные объявления пользователя (требует авторизации)
router.get("/", authMiddleware, favouritesController.getAll);

// Проверить — находится ли конкретное объявление в избранном (безопасно для гостей)
router.get("/:id", (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.json({ isFavourite: false });
  }
  return favouritesController.getOne(req, res, next);
});

// Добавить в избранное (требует авторизации)
router.post("/add", authMiddleware, favouritesController.addFav);

// Удалить из избранного (требует авторизации)
router.post("/del", authMiddleware, favouritesController.delFav);

module.exports = router;
