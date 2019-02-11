const router = require("express").Router();

router.use("/", require("./users"));
router.use("/protected", require("./protected"));

module.exports = router;
