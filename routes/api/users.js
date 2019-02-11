const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret } = require("../../config/cred");

const UserModel = require("mongoose").model("User");

router.post("/user/register", async (req, res, next) => {
  const { username, password } = req.body;

  const hashRound = 10;

  try {
    const passwordHash = await bcrypt.hash(password, hashRound);
    const userDocument = new UserModel({ username, passwordHash });

    await userDocument.save();
    return res.status(400).send({
      username
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/user/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (error, user) => {
    if (error || !user) return next(error);

    // JWT content
    const payload = {
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    };

    // assign payload to req.user
    req.login(payload, { session: false }, error => {
      if (error) return next(error);

      // Generate token
      const token = jwt.sign(JSON.stringify(payload), "SECRET");

      // Assingn token to cookies
      res.cookie("jwt", token, { httpOnly: true, secure: true });
      res.status(200).send({ username: user.username, token: token });
    });
  })(req, res, next);
});
module.exports = router;
