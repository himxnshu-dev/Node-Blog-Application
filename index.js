const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const userRouter = require("./routes/user");
const blogRoute = require("./routes/blog");
const {connectMongoDB} = require("./models/connection");
const {authenticateUserToken} = require("./middlewares/auth.middleware");
const cookieParser = require("cookie-parser");

// MongoDB connection
connectMongoDB(process.env.MONGO_URI)
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Router setup
app.use("/user", userRouter);
app.use("/blog", blogRoute);

app.get("/", authenticateUserToken, (req, res) => {
  return res.render("home", {
    user: req.user,
  });
});

app.listen(process.env.PORT, () => console.log("Server is running..."));
