const jwt = require("jsonwebtoken");

const setUser = (user) => {
  if (!user) throw new Error("Login Error!");

  try {
    const {_id, email, role} = user;
    const payload = {
      _id,
      email,
      role,
    };
    return jwt.sign(payload, process.env.SECRET_JWT);
  } catch (error) {
    console.log("Error occurred while signing the token:", error);
    return null;
  }
};

const getUser = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.SECRET_JWT);
  } catch (err) {
    console.log("Error occurred while verifying the jwt token:", err);
    return res.render("signin", {
        error: "User not authorized!"
    });
  }
};

module.exports = {getUser, setUser};
