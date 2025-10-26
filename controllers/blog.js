const Blog = require("../models/blog");
const Comment = require("../models/comment");
const {uploadOnCloudinary} = require("../services/cloudinary");

const handleGetBlogPage = (req, res) => {
  return res.render("blog", {
    user: req.user,
  });
};

const handlePostBlogs = async (req, res) => {
  // console.log(req.file)

  const upload = await uploadOnCloudinary(req.file.path);

  const {title, body} = req.body;
  const blog = await Blog.create({
    title,
    content: body,
    coverImageURL: upload.secure_url,
    createdBy: req.user._id,
  });

  console.log(
    "The blog has been successfully added to the DB with title:",
    blog.title
  );

  return res.redirect(`/blog/${blog._id}`);
};

const handleGetUserBlogInfo = async (req, res) => {
  const blogId = req.params.blogId;
  // console.log("Blog ID:", blogId)

  const blog = await Blog.findById(blogId).populate("createdBy");
  console.log("Blog title:", blog.title);

  const comments = await Comment.find({blogId}).populate("createdBy");
  //   console.log("Comment object:", comments)

  return res.render("currentBlog", {
    blog: blog,
    user: req.user,
    comments: comments,
  });
};

const handlePostCommentOnBlog = async (req, res) => {
  const {content} = req.body;

  await Comment.create({
    comment: content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.status(200).redirect(`/blog/${req.params.blogId}`);
};

const handleGetLoggedInUserBlogs = async (req, res) => {
  const userId = req.params.userId;
  const blogs = await Blog.find({createdBy: userId}).populate("createdBy");
  // console.log("User blogs:", blogs)

  return res.render("myBlogs", {
    blogs,
    user: req.user,
  });
};

module.exports = {
  handleGetBlogPage,
  handlePostBlogs,
  handleGetUserBlogInfo,
  handlePostCommentOnBlog,
  handleGetLoggedInUserBlogs,
};
