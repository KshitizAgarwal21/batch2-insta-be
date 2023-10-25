const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const axios = require("axios");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let userId = "";
server.listen(8081, () => {
  console.log("started");
});

let connectedUsers = {};
io.use((socket, next) => {
  userId = socket.handshake.query.id;
  console.log(userId);
  next();
});
io.on("connection", (socket) => {
  console.log("user connected");
  if (!connectedUsers[userId]) {
    connectedUsers[userId] = socket;

    socket.userId = userId;
  }

  // console.log(connectedUsers);

  //listening to an event from client
  socket.on("follow", (message) => {
    const targetUser = connectedUsers[message.toFollow];
    const whoWishedToFollow = message.whoWantsToFollow;

    targetUser.emit("notify", {
      followReq: true,
      liked: false,
      whoWishedToFollow: whoWishedToFollow,
    });
  });

  socket.on("like", (message) => {
    const targetUser = connectedUsers[message.personWhosPost];
    const whoLiked = message.personWhoLiked;

    targetUser.emit("notify", {
      followReq: false,
      liked: true,
      whoLiked: whoLiked,
    });
  });

  socket.on("chat", async (obj) => {
    //call an api to save in db
    //emit an event to send this msg to other participant
    let targetUser = connectedUsers[obj.recipient_id];

    targetUser.emit("newchat", obj);
    const addmessagetodb = await axios.post(
      "http://localhost:8080/chat/newmessage",
      obj
    );

    console.log(addmessagetodb.data);
  });
  socket.on("disconnect", () => {
    delete connectedUsers[socket.userId];
    console.log("User disconnected");
  });
});
