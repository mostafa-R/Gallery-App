const express = require("express");
const router = express.Router();
const controller = require("../controllers/posts");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");



// إنشاء منشور
router.post(
  "/post/create",
  auth.check,
  upload.single("name"),
  controller.create
);

// جلب جميع المنشورات
router.get("/posts", controller.getAll);

// جلب منشوراتى
router.get("/post/myposts", auth.check, controller.getUserPosts);

//بوست واحد
router.get("/post/:postId", controller.getPost);

// تعديل بيانات المنشور
router.put("/post/update/:postId", auth.check, controller.update);

// تسجيل إعجاب
router.put("/post/:postId/like", auth.check, controller.likePost);

//حذف المنشور
router.delete("/post/:postId", auth.check, controller.deletePost);

module.exports = router;
