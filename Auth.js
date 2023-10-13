const express = require("express");
const { User } = require("./Schema/UserSchema");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    profile: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      dp_url: req.body.dp_url,
      bio: req.body.bio,
    },

    followers: [],
    following: [],
    posts: [],
  };

  const newuser = new User(userData);

  const createUser = await newuser.save();
  if (createUser) {
    res.status(200).send("new user created successfully");
  }
});

router.post("/signin", async (req, res) => {
  const { username, passowrd } = req.body;

  const userExist = await User.findOne({ username: username });

  if (userExist) {
    if (userExist.passowrd === passowrd) {
      var obj = {
        username: userExist.username,
        profile: userExist.profile,
        posts: userExist.posts,
        followers: userExist.followers,
        following: userExist.following,
      };

      const token = jwt.sign(obj, "mysalt");

      res.status(200).send({ token: token });
    } else {
      res.status(401).send({ msg: "unauthorised" });
    }
  } else {
    res.status(400).send({ msg: "bad request" });
  }
});
module.exports = router;
