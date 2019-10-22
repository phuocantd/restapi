var express = require("express");
var router = express.Router();
const passport = require("passport");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "1612009" });
});

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json(req.user);
  }
);

module.exports = router;
