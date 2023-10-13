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

router.post("/likepost", async (req, res) => {
  const postWhichWasLiked = req.body.post_id;
  const userWhoLiked = "652957639a5315d69de60f04";

  const updateLikes = await Post.findByIdAndUpdate(postWhichWasLiked, {
    $push: { likes: userWhoLiked },
  });

  if (updateLikes) {
    res.status(200).send("liked successfully");
  }
});

router.post("/addcomment", async (req, res) => {
  const postWhichWasCommented = req.body.post_id;
  const userWhoCommented = "652957639a5315d69de60f04";
  const content = req.body.content;

  const comment = {
    user_id: userWhoCommented,
    content: content,
  };

  const addComment = await Post.findByIdAndUpdate(postWhichWasCommented, {
    $push: { comments: comment },
  });

  if (addComment) {
    res.status(200).send("comment added successfully");
  }
});

module.exports = router;
