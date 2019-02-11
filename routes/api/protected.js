const router = require("express").Router();
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { user } = req;
    res.status(200).send({ user });
  }
);

module.exports = router;
