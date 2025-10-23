const {Router} = require("express");
const router = Router();
const {
  handleGetUserSignin,
  handleGetUserSignup,
  handleUserSignin,
  handleUserSignup,
  handleUserLogout,
} = require("../controllers/user");
const {authenticateUserToken} = require("../middlewares/auth");

router.route("/signup").get(handleGetUserSignup).post(handleUserSignup);

router.route("/signin").get(handleGetUserSignin).post(handleUserSignin);

router.get("/logout", authenticateUserToken, handleUserLogout);

module.exports = router;
