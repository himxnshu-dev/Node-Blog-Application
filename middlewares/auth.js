const {validateUser} = require("../services/auth");

const authenticateUserToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.redirect("/user/signin");

  const user = validateUser(token);
  console.log("User object from the auth middleware:", user)
  if (!user) return res.redirect("/user/signin");
  
  req.user = user;
  return next();
};

module.exports = {authenticateUserToken};
