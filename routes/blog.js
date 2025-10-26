const {Router} = require("express");
const router = Router();
const {
  handleGetBlogPage,
  handlePostBlogs,
  handleGetUserBlogInfo,
  handlePostCommentOnBlog,
  handleGetLoggedInUserBlogs
} = require("../controllers/blog");
const upload = require("../middlewares/multer.middleware");
const {authenticateUserToken, checkForUser} = require("../middlewares/auth.middleware")

router.get("/add-new", authenticateUserToken, handleGetBlogPage);

router.post("/", authenticateUserToken, upload.single("image"), handlePostBlogs);

router.get("/:blogId", checkForUser, handleGetUserBlogInfo);

router.post("/comment/:blogId", authenticateUserToken, handlePostCommentOnBlog);

router.get("/my-blogs/:userId", authenticateUserToken, handleGetLoggedInUserBlogs)

module.exports = router;
