var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("signIn", {
    username: "Unvalidated User",
    pagetitle: "Page used for signing in to your account",
  });
});

module.exports = router;
