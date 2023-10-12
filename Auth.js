const express = require("express");
const { User } = require("./Schema/UserSchema");

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
module.exports = router;
