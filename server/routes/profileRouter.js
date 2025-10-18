const Router = require("express");
const router = new Router();
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/", authMiddleware, profileController.change);
router.get("/my", authMiddleware, profileController.getMy);
router.get("/other/:id", profileController.getOther);

module.exports = router;
