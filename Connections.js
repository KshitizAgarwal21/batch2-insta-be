const express = require("express");
const { User } = require("./Schema/UserSchema");

const router = express.Router();

router.post("/follow", async (req, res) => {
  const personwhoisloggedin = "652812f0bf41d828c0b78c60";
  const personwhowillbefollowed = req.body.user_id;

  const follow = await User.findByIdAndUpdate(personwhoisloggedin, {
    $push: { following: personwhowillbefollowed },
  });

  if (follow) {
    const updateFollowed = await User.findByIdAndUpdate(
      personwhowillbefollowed,
      {
        $push: { followers: personwhoisloggedin },
      }
    );

    if (updateFollowed) {
      res.status(200).send("followed successfully");
    }
  }
});
module.exports = router;
