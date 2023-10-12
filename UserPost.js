const express = require("express");
const { Post } = require("./Schema/PostsSchema");

const router = express.Router();

router.post("/addpost", async (req, res) => {
  const post = {
    user_id: "652812f0bf41d828c0b78c60",
    media: req.body.media_url,
    caption: req.body.caption,
  };

  const newpost = new Post(post);

  const createPost = await newpost.save();
  if (createPost) {
    res.status(200).send("post added successfully");
  }
});

module.exports = router;
