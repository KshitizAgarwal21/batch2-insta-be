const mongoose = require("mongoose");

const story = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    media: {
      type: String,
    },

    expirationTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("post", story);

module.exports = { Story };
