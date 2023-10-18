const express = require("express");
const { Chat } = require("./Schema/ChatSchema");

const router = express.Router();

router.get("/chatlist", async (req, res) => {
  const loggedinuserid = "652812f0bf41d828c0b78c60";

  const chatlist = await Chat.find(
    {
      "participants.participant1": loggedinuserid,
    } || { "participants.particpant2": loggedinuserid }
  );

  if (chatlist) {
    res.send(chatlist);
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
  const loggedinuserid = "652812f0bf41d828c0b78c60";
  const pranav = "652957639a5315d69de60f04";

  const addChat = await Chat.findOneAndUpdate(
    {
      "participants.participant1": loggedinuserid,
    } || { "participants.particpant2": loggedinuserid },
    {
      $push: {
        content: {
          author_id: pranav,
          message: "Yes tell me I am free now",
        },
      },
    }
  );
  if (addChat) {
    console.log(addChat);
  }
});

module.exports = router;
