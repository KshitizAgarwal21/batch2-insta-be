const express = require("express");
const { Post } = require("./Schema/PostsSchema");
const { User } = require("./Schema/UserSchema");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/follow", async (req, res) => {
  const personwhoisloggedin = "652812f0bf41d828c0b78c60";
  const personwhowillbefollowed = req.body.user_id;

  const follow = await User.findByIdAndUpdate(personwhoisloggedin, {
    $push: { following: personwhowillbefollowed },
  });

  if (follow) {
    const updateFollowed = await User.findByIdAndUpdate(
      personwhowillbefollowed,
      {
        $push: { followers: personwhoisloggedin },
      }
    );

    if (updateFollowed) {
      res.status(200).send("followed successfully");
    }
  }
});

router.post("/followrecommend", async (req, res) => {
  //first check who is asking for the recommendations

  const whoisloggedin = req.headers.authorization;

  const getProfile = await User.findById(whoisloggedin);
  // the following list of this person

  const getProfiles = await User.find({});

  const profiles = getProfiles.map((elem) => elem._id);

  if (getProfile) {
    //give me the id's of only those person who are not already in the following list of
    //this person
    const responsearr = profiles.filter(
      (elem) => !getProfile.following.includes(elem)
    );
    res.status(200).send(responsearr.filter((elem) => elem != whoisloggedin));
  }

  // getProfile.following.forEach((elem) => {
  //   getProfiles.forEach((ele) => {
  //     if (ele._id.toString() != elem.toString()) {
  //       resultarr.push(ele._id);
  //     }
  //   });
  // });

  //now filter our array to remove those people who are already followed by whoisloggedin and the person itself
  // const followingalready = getProfiles.filter((elem) => {
  //   return elem._id.toString() == whoisloggedin;
  // });

  // console.log(followingalready[0].following);
});

router.post("/acceptfollow", async (req, res) => {
  const whoisloggedin = req.headers.authorization;
  const whowishedtofollow = req.body.id;

  const alreadyfollower = await User.findById(whoisloggedin);
  const updateFollowers = await User.findByIdAndUpdate(whoisloggedin, {
    $push: { followers: whowishedtofollow },
  });

  const updateFollowing = await User.findByIdAndUpdate(whowishedtofollow, {
    $push: { following: whoisloggedin },
  });

  res.status(200).send("follow request accepted");
});

router.post("/like", async (req, res) => {
  const { whoPosted, wholiked, postid } = req.body;

  const likesarr = await Post.findById(postid);

  if (!likesarr.likes.includes(wholiked)) {
    const updateLikes = await Post.findByIdAndUpdate(postid, {
      $push: { likes: wholiked },
    });

    if (updateLikes) {
      res.status(200).send("post liked successfully");
    }
  } else {
    console.log("this person has already liked this post");
  }
});
router.post("/unfollow", async (req, res) => {
  const whoisbeingunfollowed = req.body.whoisbeingunfollowed;

  const whoisunfollowing = req.headers.authorization;

  const removefollowing = await User.findByIdAndUpdate(whoisunfollowing, {
    $pull: { following: mongoose.Types.ObjectId(whoisbeingunfollowed) },
  });

  console.log(removefollowing);

  if (removefollowing) {
    const removefollower = await User.findByIdAndUpdate(whoisbeingunfollowed, {
      $pull: { followers: mongoose.Types.ObjectId(whoisunfollowing) },
    });

    console.log(removefollower);

    if (removefollower) {
      res.status(200).send("unfollowed successfully");
    }
  }
});
module.exports = router;
