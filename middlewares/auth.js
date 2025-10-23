const User = require("../models/user");
const {validateUser} = require("../services/auth");

const authenticateUserToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.redirect("/user/signin");

    const user = validateUser(token);
    //   console.log("User object from the auth middleware:", user)
    if (!user) return res.redirect("/user/signin");

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Token expired:", err.name);

      const options = {
        httpOnly: true,
        secure: true,
      };

      try {
        const refreshToken = req.cookies.refreshToken;
        const user = await User.findOne({refreshToken});
        if (user) {
          await User.findOneAndUpdate(user._id, {
            $unset: {
              refreshToken: 1,
            },
          });
          console.log("User refresh token successfully removed from the DB!");
        }
      } catch (error) {
        console.log(
          "Error during removal of refresh token from the DB:",
          error.name,
          error.message
        );
      }

      return res
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .redirect("/user/signin");
    } else {
      console.log(
        "Error occurred while authenticating the user:",
        err.name,
        err.message
      );
      return res.redirect("/user/signin");
    }
  }
};

module.exports = {authenticateUserToken};
