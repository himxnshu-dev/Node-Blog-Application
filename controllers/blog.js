const Blog = require("../models/blog")
const User = require("../models/user")

const handleGetBlogPage = (req, res) => {
    return res.render("blog", {
        user: req.user
    })
}

const handlePostBlogs = async (req, res) => {
    // console.log(req.file)
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        content: body,
        coverImageURL: req.file ? `/uploads/${req.file.filename}` : null,
        createdBy: req.user._id
    })

    console.log("The blog has been successfully added to the DB with title:", blog.title)

    return res.redirect(`/blog/${blog._id}`)
}

const handleGetUserBlogInfo = async (req, res) => {
    const blogId = req.params.blogId
    // console.log("Blog ID:", blogId)

    const blog = await Blog.findById(blogId).populate("createdBy")
    console.log("Blog title:", blog.title)



    return res.render("currentBlog", {
        blog: blog,
        user:req.user,
    })
}

module.exports = { handleGetBlogPage, handlePostBlogs, handleGetUserBlogInfo }