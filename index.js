const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const userRouter = require("./routes/user");
const blogRoute = require("./routes/blog");
const {connectMongoDB} = require("./models/connection");
const {checkForUser} = require("./middlewares/auth.middleware");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");

// MongoDB connection
connectMongoDB(process.env.MONGO_URI)
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static("./public"));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Router setup
app.use("/user", userRouter);
app.use("/blog", blogRoute);

app.get("/", checkForUser, async (req, res) => {
  const allBlogs = await Blog.find({});

  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.listen(process.env.PORT, () => console.log("Server is running..."));
