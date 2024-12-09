var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("signUp", {
    username: "Unvalidated User",
    pagetitle: "Page used for signing Up your account",
  });
});

module.exports = router;
