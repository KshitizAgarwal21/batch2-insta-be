const mongoose = require("mongoose");

const chat = new mongoose.Schema({
  participants: {
    participant1: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    participant2: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },

  content: [
    {
      type: new mongoose.Schema(
        {
          author_id: {
            type: mongoose.Schema.Types.ObjectId,
          },
          message: {
            type: String,
          },
        },
        { timestamps: true }
      ),
    },
  ],
});
const Chat = mongoose.model("chat", chat);

module.exports = { Chat };
