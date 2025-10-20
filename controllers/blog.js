const Blog = require("../models/blog")

const handleGetBlogPage = (req, res) => {
    return res.render("blog", {
        user: req.user
    })
}

module.exports = { handleGetBlogPage }