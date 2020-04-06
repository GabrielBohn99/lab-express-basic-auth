const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const User = require("../models/user");

router.get("/signup", (req, res) => {
  res.render("sign-up");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (!username || !password) {
    res.render("sign-up", { errorMessage: "Please add username or password" });
    return;
  }

  User.create({ username, password: hashPass })
    .then((user) => {
      console.log(user);
      res.redirect("/login");
    })
    .catch((err) =>
      res.render("sign-up", { errorMessage: "Username already been used" })
    );
});

router.get("/login", (req, res) => {
  res.render("login-form");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("login-form", {
      errorMessage: "Please add username or password",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      //checking if username exists in the DB

      if (!user) {
        res.render("login-form", {
          errorMessage: "Wrong username or password",
        });
        return;
      }

      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.render("login-form", {
          errorMessage: "Wrong password or username",
        });
      }
    })
    .catch((err) => console.log(err));
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
