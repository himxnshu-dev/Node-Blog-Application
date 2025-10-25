const Blog = require("../models/blog")

const handleGetBlogPage = (req, res) => {
    return res.render("blog", {
        user: req.user
    })
}

const handlePostBlogs = (req, res) => {
    // console.log(req.body)

    return res.redirect("/")
}

module.exports = { handleGetBlogPage, handlePostBlogs }