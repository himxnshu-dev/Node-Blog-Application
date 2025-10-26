const User = require("../models/user");
const jwt = require("jsonwebtoken");

const checkForUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return next();

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const options = {
        httpOnly: true,
        secure: true,
      };

      try {
        const incomingRefToken =
          req.cookies?.refreshToken ||
          req.header("Authorization")?.replace("Bearer ", "");
        if (!incomingRefToken) {
          res.clearCookie("accessToken", options);
          return next();
        }

        const decodedUser = jwt.verify(
          incomingRefToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedUser._id);

        if (!user || incomingRefToken !== user.refreshToken) {
          res
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options);
          return next();
        }

        const payload = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        };

        const newAccessToken = jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: "10s"}
        );
        console.log("New access token:", newAccessToken);

        res.cookie("accessToken", newAccessToken, options);

        req.user = payload;
        next();
      } catch (err) {
        console.log("Error while generating a new access token:", err);
        res
          .clearCookie("accessToken", options)
          .clearCookie("refreshToken", options);
        return next();
      }
    } else {
      return next();
    }
  }
};

const authenticateUserToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.redirect("/user/signin");

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //   console.log("User object from the auth middleware:", user)
    if (!user) return res.redirect("/user/signin");

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      //   console.log("Token expired with error:", err.name);

      const options = {
        httpOnly: true,
        secure: true,
      };
      try {
        const refreshToken =
          req.cookies?.refreshToken ||
          req.header("Authorization")?.replace("Bearer ", "");
        if (!refreshToken) return res.status(401).redirect("/user/signin");

        const decodedUser = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedUser._id);
        if (!user) return res.status(403).redirect("/user/signin");

        if (refreshToken !== user.refreshToken)
          return res
            .status(403)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .redirect("/user/signin");

        const payload = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        };

        const newAccessToken = jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "10s",
          }
        );
        console.log("New access token generated:", newAccessToken);

        res.cookie("accessToken", newAccessToken, options);
        req.user = payload;
        next();
      } catch (error) {
        console.log("Error while generating a new access token:", error.name);
        return res
          .status(403)
          .clearCookie("accessToken", options)
          .clearCookie("refreshToken", options)
          .redirect("/user/signin");
      }
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

module.exports = {authenticateUserToken, checkForUser};
