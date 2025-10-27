const {Router} = require("express");
const router = Router();
const {
  handleGetBlogPage,
  handlePostBlogs,
  handleGetUserBlogInfo,
  handlePostCommentOnBlog,
  handleGetLoggedInUserBlogs,
  handleDeleteBlog
} = require("../controllers/blog");
const upload = require("../middlewares/multer.middleware");
const {authenticateUserToken, checkForUser} = require("../middlewares/auth.middleware")

router.get("/add-new", authenticateUserToken, handleGetBlogPage);

router.post("/", authenticateUserToken, upload.single("image"), handlePostBlogs);

router.route("/:blogId").get(checkForUser, handleGetUserBlogInfo);

router.post("/comment/:blogId", authenticateUserToken, handlePostCommentOnBlog);

router.get("/my-blogs/:userId", authenticateUserToken, handleGetLoggedInUserBlogs);

router.post("/delete-blog/:blogId", authenticateUserToken, handleDeleteBlog);

module.exports = router;
