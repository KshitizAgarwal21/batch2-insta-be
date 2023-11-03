const express = require("express");
const { Post } = require("./Schema/PostsSchema");
const { User } = require("./Schema/UserSchema");
const multer = require("multer");
var FormData = require("form-data");
const { default: axios } = require("axios");
var maxSize = 1 * 1000 * 1000;
const router = express.Router();
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + Date.now() + `.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "pdf" ||
    file.mimetype.split("/")[1] === "jpeg" ||
    file.mimetype.split("/")[1] === "jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File is not of supported format"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: maxSize },
}).single("myFile");

router.post("/addpost", async (req, res) => {
  console.log(req.body);
  const post = {
    user_id: req.headers.authorization,
    media: req.body.fileUrl,
    caption: req.body.caption,
  };

  const newpost = new Post(post);

  const createPost = await newpost.save();
  if (createPost) {
    const postid = createPost._id;

    const addpostinuser = await User.findByIdAndUpdate(
      req.headers.authorization,
      { $push: { posts: postid } }
    );
    if (addpostinuser) {
      res.status(200).send("post added successfully");
    }
  }
});
// router.post("/addpost", async (req, res) => {
//   const post = {
//     user_id: req.headers.authorization,
//     media: req.body.media_url,
//     caption: req.body.caption,
//   };

//   const newpost = new Post(post);

//   const createPost = await newpost.save();
//   if (createPost) {
//     res.status(200).send("post added successfully");
//   }
// });

router.post("/getposts", async (req, res) => {
  //first check who is logged in or who has opened his profile
  const whoseProfileIsIt = req.headers.authorization;
  // find the follwing list of that person
  const findFollowingList = await User.findById(whoseProfileIsIt);
  if (findFollowingList) {
    if (findFollowingList.following.length != 0) {
      //find the posts added by all the people in following list and return to frontend
      if (findFollowingList) {
        findFollowingList.following.push(whoseProfileIsIt);
        const posts = findFollowingList.following.map(async (elem) => {
          return await Post.find({ user_id: elem });
        });

        Promise.all(posts).then((response) => {
          let finalarr = [];
          response.forEach((elem) => {
            elem.map((ele) => {
              finalarr.push(ele);
            });
          });
          console.log(finalarr);
          res.status(200).send(finalarr);
        });
      }
    } else {
      const posts = await Post.find({ user_id: whoseProfileIsIt });

      res.status(200).send(posts);
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
