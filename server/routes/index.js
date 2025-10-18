const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const profileRouter = require("./profileRouter");
const favouritesRouter = require("./favouritesRouter");
const shelterRouter = require("./shelterRouter");
//const animalRouter = require("./animalRouter");

const advertisementRouter = require("./advertisementRouter");
router.use("/user", userRouter);
router.use("/advertisement", advertisementRouter);
//router.use("/animal", animalRouter);
router.use("/profile", profileRouter);
//router.use("/order", orderRouter);
router.use("/favourite", favouritesRouter);
router.use("/shelter", shelterRouter);
module.exports = router;
