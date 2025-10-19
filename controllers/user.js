const User = require("../models/user");
const bcrypt = require("bcrypt");

const handleGetUserSignup = (req, res) => {
  return res.render("signup");
};

const handleGetUserSignin = (req, res) => {
  return res.render("signin");
};

const handleUserSignup = async (req, res) => {
  const {name, email, password} = req.body;
  await User.create({
    fullName: name,
    email,
    password
  });
  return res.redirect("signin");
};

const handleUserSignin = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});
    console.log("Current user:", user);
    if (!user) throw new Error("User not found in the DB!");

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched)
      return res.render("signin", {
        msg: "The password doesn't match!",
      });

    return res.status(200).redirect("/");
  } catch (err) {
    console.log("Error occurred:", err);
    return res.render("signin", {
        msg: "An internal error occurred, please try again!"
    });
  }
};

module.exports = {
  handleGetUserSignin,
  handleGetUserSignup,
  handleUserSignup,
  handleUserSignin,
};
