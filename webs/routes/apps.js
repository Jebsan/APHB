var express = require("express");
var router = express.Router();
var User = require("../models/user-model");


router.get("/", function (req, res, next) {
  res.render("apps", { pagetitle: "Apps on APHB" });
});

module.exports = router;
