const express = require("express");
const { Chat } = require("./Schema/ChatSchema");

const router = express.Router();

router.get("/chatlist", async (req, res) => {
  const loggedinuserid = req.headers.authorization;
  console.log(loggedinuserid);
  const chatlist = await Chat.find({
    "participants.participant1": loggedinuserid,
  });

  const chatlistalt = await Chat.find({
    "participants.participant2": loggedinuserid,
  });
  console.log(chatlistalt);
  if (chatlist.length != 0) {
    res.send(chatlist);
  } else {
    res.send(chatlistalt);
  }
});

router.post("/convo", async (req, res) => {
  const loggedinuserid = req.headers.authorization;

  const getconversation = await Chat.findById(req.body.conversation_id);

  if (getconversation) {
    res.status(200).send(getconversation);
  }
});

router.post("/newmessage", async (req, res) => {
  const { author_id, recipient_id, message, conversation_id } = req.body;

  const addChat = await Chat.findByIdAndUpdate(conversation_id, {
    $push: {
      content: {
        author_id: author_id,
        message: message,
      },
    },
  });
  if (addChat) {
    res.status(200).send("added chat");
  }
});

module.exports = router;
