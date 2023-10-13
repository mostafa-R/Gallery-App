const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/login", controller.login);
router.post("/register", controller.register);
router.get("/profile", auth.check, controller.me);
router.put("/profile/update", auth.check, controller.updateProfile);
router.put(
  "/profile/upload-photo",
  upload.single("avatar"),
  auth.check,
  controller.uploadUserPhoto
);

router.post("/logout", auth.check,controller.logout);

module.exports = router;
