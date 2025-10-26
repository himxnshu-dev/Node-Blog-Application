const {Router} = require("express");
const router = Router();
const {
  handleGetBlogPage,
  handlePostBlogs,
  handleGetUserBlogInfo,
  handlePostCommentOnBlog,
} = require("../controllers/blog");
const upload = require("../middlewares/multer.middleware");

router.get("/add-new", handleGetBlogPage);

router.post("/", upload.single("image"), handlePostBlogs);

router.get("/:blogId", handleGetUserBlogInfo);

router.post("/comment/:blogId", handlePostCommentOnBlog);

module.exports = router;
