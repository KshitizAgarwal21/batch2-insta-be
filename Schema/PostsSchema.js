const mongoose = require("mongoose");

const post = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  media: {
    type: String,
  },

  caption: {
    type: String,
  },
  likes: {
    type: Number,
  },
});

const Post = mongoose.model("post", post);

module.exports = { Post };
