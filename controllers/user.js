const User = require("../models/user");
const bcrypt = require("bcrypt");
const {setUser, generateAccessAndRefreshTokens} = require("../services/auth");

const handleGetUserSignup = (req, res) => {
  return res.render("signup");
};

const handleGetUserSignin = (req, res) => {
  return res.render("signin");
};

const handleUserSignup = async (req, res) => {
  const {name, email, password} = req.body;

  const user = await User.findOne({email});
  if (user)
    return res.render("signin", {
      error: "This email is already registered!",
    });

  await User.create({
    fullName: name,
    email,
    password,
  });
  return res.redirect("signin");
};

const handleUserSignin = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    // console.log("Current user:", user);
    if (!user)
      return res.render("signin", {
        error: "User does not exist!",
      });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return res.render("signin", {
        error: "The password doesn't match!",
      });

    // const jwtToken = setUser(user);
    // res.cookie("token", jwtToken);
    // console.log("Token created:", jwtToken);

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(
      user._id
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .redirect("/");
  } catch (err) {
    console.log("Error occurred:", err);
    return res.status(500).render("signin", {
      error: "An internal error occurred, please try again!",
    });
  }
};

const handleUserLogout = (req, res) => {
  res.clearCookie("accessToken");

  return res.redirect("/");
};

module.exports = {
  handleGetUserSignin,
  handleGetUserSignup,
  handleUserSignup,
  handleUserSignin,
  handleUserLogout,
};
