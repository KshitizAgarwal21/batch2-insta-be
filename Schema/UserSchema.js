const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profile: {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    dp_url: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
  },

  followers: [mongoose.Schema.Types.ObjectId],
  following: [mongoose.Schema.Types.ObjectId],
  posts: [mongoose.Schema.Types.ObjectId],
  conversations: [mongoose.Schema.Types.ObjectId],
});

const reset = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", user);
const Reset = mongoose.model("otp", reset);
module.exports = { User, Reset };
