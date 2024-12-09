var express = require("express");
var router = express.Router();

function renderPage(req, res) {
  if (req.user) {
    res.render("tips", {
      pagetitle: "Tips From Jens to you!",
      username: req.user.username,
    });
  }
}

router.get("/", renderPage);

module.exports = router;
