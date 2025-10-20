const {Router} = require('express')
const router = Router();
const {handleGetBlogPage} = require("../controllers/blog")
const {authenticateUserToken} = require("../middlewares/auth")

router.get('/add-new',authenticateUserToken, handleGetBlogPage)

module.exports = router