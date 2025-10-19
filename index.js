const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const userRouter = require("./routes/user");
const {connectMongoDB} = require("./models/connection");

// MongoDB connection
connectMongoDB(process.env.MONGO_URI)
  .then(() => console.log("DB connected!"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Router setup
app.use("/user", userRouter);

app.get("/", (req, res) => {
  return res.render("home");
});

app.listen(process.env.PORT, () => console.log("Server is running..."));
