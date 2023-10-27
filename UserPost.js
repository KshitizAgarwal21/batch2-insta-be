const express = require("express");
const { Post } = require("./Schema/PostsSchema");
const { User } = require("./Schema/UserSchema");

const router = express.Router();

router.post("/addpost", async (req, res) => {
  const post = {
    user_id: req.headers.authorization,
    media: req.body.media_url,
    caption: req.body.caption,
  };

  const newpost = new Post(post);

  const createPost = await newpost.save();
  if (createPost) {
    res.status(200).send("post added successfully");
  }
});

router.post("/getposts", async (req, res) => {
  //first check who is logged in or who has opened his profile
  const whoseProfileIsIt = req.headers.authorization;
  // find the follwing list of that person
  const findFollowingList = await User.findById(whoseProfileIsIt);
  console.log(findFollowingList.following);
  if (findFollowingList.following.length != 0) {
    //find the posts added by all the people in following list and return to frontend
    if (findFollowingList) {
      findFollowingList.following.push(whoseProfileIsIt);
      const posts = findFollowingList.following.map(async (elem) => {
        return await Post.findOne({ user_id: elem });
      });

      Promise.all(posts).then((response) => {
        res.status(200).send(response);
      });
    }
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
