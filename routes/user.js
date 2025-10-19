const {Router} = require("express");
const router = Router();
const {
  handleGetUserSignin,
  handleGetUserSignup,
  handleUserSignin,
  handleUserSignup,
} = require("../controllers/user");

router.route("/signup").get(handleGetUserSignup).post(handleUserSignup);

router.route("/login").get(handleGetUserSignin).post(handleUserSignin);

module.exports = router;
