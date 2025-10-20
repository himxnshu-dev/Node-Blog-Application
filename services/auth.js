const jwt = require("jsonwebtoken");

const setUser = (user) => {
  if (!user) throw new Error("Login Error!");

  try {
    const {_id, fullName, email, role} = user;
    const payload = {
      _id,
      fullName,
      email,
      role,
    };
    return jwt.sign(payload, process.env.SECRET_JWT);
  } catch (error) {
    console.log("Error occurred while signing the token:", error);
    return null;
  }
};

const validateUser = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.SECRET_JWT);
  } catch (err) {
    console.log("Error occurred while verifying the jwt token:", err);
    return null;
  }
};

module.exports = {validateUser, setUser};
