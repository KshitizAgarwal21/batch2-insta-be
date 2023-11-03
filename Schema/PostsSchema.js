const mongoose = require("mongoose");

const post = new mongoose.Schema(
  {
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
    likes: [mongoose.Schema.Types.ObjectId],

    comments: [
      {
        user_id: mongoose.Schema.Types.ObjectId,
        content: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("post", post);

module.exports = { Post };
