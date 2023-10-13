const express = require("express");
const auth = require("./Auth");
const posts = require("./UserPost");
const router = express.Router();
const connection = require("./Connections");
router.use("/auth", auth);
router.use("/posts", posts);
router.use("/connections", connection);
module.exports = router;
