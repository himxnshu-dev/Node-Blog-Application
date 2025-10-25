const {Router} = require("express");
const router = Router();
const {handleGetBlogPage, handlePostBlogs} = require("../controllers/blog");
const {authenticateUserToken} = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.get("/add-new", authenticateUserToken, handleGetBlogPage);

router.post("/", upload.single("image"), handlePostBlogs);

module.exports = router;
