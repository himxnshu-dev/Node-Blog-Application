const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateUser = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.log("Error occurred while verifying the jwt token:", err.message);
    return null;
  }
};

const generateAccessAndRefreshTokens = async (userId) => {
  if (!userId) return null;

  try {
    const user = await User.findById(userId);
    console.log("User object:", user);
    if (!user) return null;

    const {_id, email, password, role} = user;
    const payload = {
      _id,
      email,
      password,
      role,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
  } catch (error) {
    console.log(
      "Error occurred while creating access and refresh token:",
      error
    );
  }
};

module.exports = {validateUser, generateAccessAndRefreshTokens};
