const Router = require("express");
const router = new Router();
const ShelterController = require("../controllers/shelterController");
const authMiddleware = require("../middleware/authMiddleware");
router.get("/", ShelterController.allShelters);

module.exports = router;
