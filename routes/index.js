const express=require("express");
const router=express.Router();
const home_controller=require("../controllers/home_controller");

router.get("/", home_controller.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/likes", require("./likes"));

router.use("/api", require("./api"))

module.exports=router;