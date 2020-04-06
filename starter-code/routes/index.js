const express = require("express");
const router = express.Router();
const User = require("../models/user");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.currentUser });
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/main", (req, res, next) => {
  res.render("home", { user: req.session.currentUser });
});

router.get("/private", (req, res, next) => {
  res.render("private", { user: req.session.currentUser });
});

module.exports = router;
