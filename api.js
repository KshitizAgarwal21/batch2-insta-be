const express = require("express");
const auth = require("./Auth");
const posts = require("./UserPost");
const router = express.Router();

router.use("/auth", auth);
router.use("/posts", posts);
module.exports = router;
