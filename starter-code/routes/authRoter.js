const express = require('express');
const router  = express.Router();
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");
const bcrypt = require('bcryptjs');
const bcryptjsSalt = 10;



router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ name: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptjsSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = User({
      name: username,
      password: hashPass
    });

    newUser.save(err => {
      res.redirect("/");
    });
  });
});

  router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "auth/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", { user: req.user });
});


module.exports = router;

