var express = require("express");
var router = express.Router();
var User = require("../models/user-model");

function renderPage(req, res) {
  if (req.user) {
    res.render("profile", {
      pagetitle: "The Profile Page",
      username: req.user.username,
      email: req.user.email,
    });
  } else {
    res.redirect("/auth/signIn");
  }
}

// POST update username
router.post("/update-username", async (req, res) => {
  if (!req.user) {
    return res.redirect("/auth/signIn");
  }

  const { username } = req.body;

  try {
    await User.update({ username }, { where: { id: req.user.id } });

    // Update the user object in the session
    req.user.username = username;

    res.redirect("/profile");
  } catch (e) {
    console.error(e);
    res.redirect("/profile?failed=1");
  }
});

// POST update email
router.post("/update-email", async (req, res) => {
  if (!req.user) {
    return res.redirect("/auth/signIn");
  }

  const { email } = req.body;

  try {
    await User.update({ email }, { where: { id: req.user.id } });

    // Update the user object in the session
    req.user.email = email;

    res.redirect("/profile");
  } catch (e) {
    console.error(e);
    res.redirect("/profile?failed=1");
  }
});

router.get("/", renderPage);

module.exports = router;
