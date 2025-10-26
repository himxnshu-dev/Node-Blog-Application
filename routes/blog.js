const {Router} = require("express");
const router = Router();
const {handleGetBlogPage, handlePostBlogs, handleGetUserBlogInfo} = require("../controllers/blog");
const {authenticateUserToken} = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.get("/add-new", handleGetBlogPage);

router.post("/", upload.single("image"), handlePostBlogs);

router.get("/:blogId", handleGetUserBlogInfo)

module.exports = router;
