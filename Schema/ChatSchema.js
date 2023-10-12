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
      senderid: {
        type: mongoose.Schema.Types.ObjectId,
      },
      recieverid: {
        type: mongoose.Schema.Types.ObjectId,
      },
      message: {
        type: String,
      },
      timeStamp: {
        type: timeStamp,
      },
    },
  ],
});
const Chat = mongoose.model("chat", chat);

module.exports = { Chat };
