const Router = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const favouritesController = require("../controllers/favouritesController");

const router = new Router();

// Получить все избранные объявления пользователя
router.get("/", authMiddleware, favouritesController.getAll);

// Проверить — находится ли конкретное объявление в избранном
router.get("/:id", authMiddleware, favouritesController.getOne);

// Добавить в избранное
router.post("/add", authMiddleware, favouritesController.addFav);

// Удалить из избранного
router.post("/del", authMiddleware, favouritesController.delFav);

module.exports = router;
