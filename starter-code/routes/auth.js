const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const Picture = require("../models/Picture");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const upload = multer({ dest: "./public/uploads/" });

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", upload.single("photo"), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save().then(() => {
      const pic = new Picture({
        name: req.body.name,
        path: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        user_id: newUser._id
      });

      pic
        .save(err => {
          res.redirect("/");
        })
        .catch(err => {
          res.render("auth/signup", { message: "Something went wrong" });
        });
    });
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
