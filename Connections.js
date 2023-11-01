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

router.post("/followrecommend", async (req, res) => {
  //first check who is asking for the recommendations

  const whoisloggedin = req.headers.authorization;

  const getProfile = await User.findById(whoisloggedin);

  const getProfiles = await User.find({});

  const profiles = getProfiles.map((elem) => elem._id);
  console.log(profiles);
  let resultarr = [];
  if (getProfile.following.length != 0) {
    profiles.map((elem) => {
      getProfile.following.forEach((ele) => {
        if (elem.toString() != ele.toString()) {
          resultarr.push(elem);
        }
      });
    });

    const obj = resultarr.reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr]++;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {});
    let finalarr = [];
    for (key in obj) {
      if (obj[key] == 2) {
        finalarr.push(key);
      }
    }

    const responsearr = finalarr.filter((elem) => elem != whoisloggedin);

    res.status(200).send(responsearr);
  } else {
    res.status(200).send(profiles.filter((elem) => elem != whoisloggedin));
  }

  // getProfile.following.forEach((elem) => {
  //   getProfiles.forEach((ele) => {
  //     if (ele._id.toString() != elem.toString()) {
  //       resultarr.push(ele._id);
  //     }
  //   });
  // });

  //now filter our array to remove those people who are already followed by whoisloggedin and the person itself
  // const followingalready = getProfiles.filter((elem) => {
  //   return elem._id.toString() == whoisloggedin;
  // });

  // console.log(followingalready[0].following);
});
module.exports = router;
