const express = require("express");
const { Post } = require("./Schema/PostsSchema");
const { User } = require("./Schema/UserSchema");
const multer = require("multer");
const schedule = require("node-schedule");

const { default: axios } = require("axios");
const { Story } = require("./Schema/StorySchema");
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

router.post("/addstory", async (req, res) => {
  console.log(req.body);

  const now = new Date();

  const expirationTime = now.getHours() + 24;

  const story = {
    user_id: req.headers.authorization,
    media: req.body.fileUrl,
    expirationTime: expirationTime,
  };

  const newpost = new Story(story);

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

schedule.scheduleJob("removeStory", async () => {
  const timenow = new Date();

  const removeStory = await Story.deleteMany({
    expirationTime: { $lte: timenow },
  });

  if (removeStory) {
    console.log("story removed");
  }
});

module.exports = router;
