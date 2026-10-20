const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");
const advertisementController = require("../controllers/advertisementController");

router.post("/filter", advertisementController.getAllFilter);
router.get("/filter", advertisementController.getAllFilter);

router.post("/", authMiddleware, advertisementController.create);

router.get("/user/:id", advertisementController.getByUserId);

router.get("/", advertisementController.getAll);

router.get("/my", authMiddleware, advertisementController.getmyAds);

router.get("/moderation/all", authMiddleware, advertisementController.getModerationAll);

router.get("/:id", advertisementController.getOne);

router.put("/:id", authMiddleware, advertisementController.changeAds);

router.delete("/:id", authMiddleware, advertisementController.deleteAds);

module.exports = router;
