var express = require("express");
var crypto = require("crypto");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("../models/user-model");

var router = express.Router();

/* Passport Configuration  */

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    try {
      const user = await User.findOne({
        where: { username: username },
      });
      if (!user) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (err) {
            return done(err);
          }

          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return done(null, user);
        }
      );
    } catch (e) {
      return done(e);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id).then(function (user) {
    done(null, user);
  });
});

router.post(
  "/signIn",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/signIn?failed=1",
  })
);

router.get("/signIn", (req, res, next) => {
  const failed = req.query.failed;
  res.render("signIn", { failed: failed });
});

router.post("/signUp", (req, res, next) => {
  let salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    async function (err, hashedPassword) {
      if (err) {
        res.redirect("/auth/signUp?failed=1");
      }

      try {
        const user = await User.create({
          username: req.body.username,
          password: hashedPassword,
          salt: salt,
        });

        req.login(user, function (err) {
          if (err) {
            res.redirect("/auth/signUp?failed=3");
          }
          res.redirect("/");
        });
      } catch (e) {
        res.redirect("/auth/signUp?failed=2");
      }
    }
  );
});

router.get("/signUp", (req, res, next) => {
  const failed = req.query.failed;

  let msg = "";
  switch (failed) {
    case "1":
      msg = "Something went wrong on our side.";
      break;
    case "2":
      msg = "Username taken.";
      break;
    case "3":
      msg = "Failed to login.";
      break;
  }
  res.render("signUp", { failed: failed, msg: msg });
});

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
