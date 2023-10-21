const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
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
      whoWishedToFollow: whoWishedToFollow,
    });
  });
  socket.on("disconnect", () => {
    delete connectedUsers[socket.userId];
    console.log("User disconnected");
  });
});
