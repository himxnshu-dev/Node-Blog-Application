const {validateUser} = require("../services/auth");

const authenticateUserToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/user/signin");

  const user = validateUser(token);
  if (!user) return res.redirect("/user/signin");
  
  req.user = user;
  return next();
};

module.exports = {authenticateUserToken};
