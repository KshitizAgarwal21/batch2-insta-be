const express = require("express");
const { User, Reset } = require("./Schema/UserSchema");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const { Post } = require("./Schema/PostsSchema");
const router = express.Router();

router.post("/register", async (req, res) => {
  const alreadyexists = await User.findOne({ email: req.body.email });

  if (alreadyexists) {
    res
      .status(200)
      .send("Email id is already registered, kindly login to continue");
  } else {
    const userData = {
      username: req.body.userData.username,
      password: req.body.userData.password,
      email: req.body.userData.email,
      profile: {
        first_name: req.body.userData.first_name,
        last_name: req.body.userData.last_name,
        dp_url: req.body.dp_url,
        bio: req.body.userData.bio,
      },

      followers: [],
      following: [],
      posts: [],
    };
    const newuser = new User(userData);

    const createUser = await newuser.save();
    if (createUser) {
      res.status(200).send("new user created successfully");
    }
  }
});

router.post("/signin", async (req, res) => {
  const { username, passowrd } = req.body;

  const userExist = await User.findOne({ username: username });

  if (userExist) {
    if (userExist.passowrd === passowrd) {
      var obj = {
        userid: userExist._id,
        username: userExist.username,
        profile: userExist.profile,
        posts: userExist.posts,
        followers: userExist.followers,
        following: userExist.following,
      };

      const token = jwt.sign(obj, "mysalt");

      res.status(200).send({ token: token });
    } else {
      res.status(401).send({ msg: "unauthorised" });
    }
  } else {
    res.status(400).send({ msg: "bad request" });
  }
});

router.post("/getuserDetails", async (req, res) => {
  const user_id = req.body.id;

  const userDetails = await User.findById(user_id);

  if (userDetails) {
    res.status(200).send(userDetails.profile);
  }
});
router.post("/getUserProfile", async (req, res) => {
  const user_id = req.body.id;

  const userDetails = await User.findById(user_id);

  if (userDetails) {
    res.status(200).send({
      profile: userDetails.profile,
      followers: userDetails.followers,
      following: userDetails.following,
      posts: userDetails.posts,
    });
  }
});
router.post("/generateotp", async (req, res) => {
  let otp = Math.floor(Math.random(0, 1) * 1000000);

  const resetschema = {
    email: req.body.email,
    otp: otp,
  };

  const otpschema = new Reset(resetschema);

  const tempstoreotp = await otpschema.save();

  if (tempstoreotp) {
    setTimeout(async () => {
      console.log("came here");
      const deleteotp = await Reset.findByIdAndDelete(tempstoreotp._id);
      console.log(deleteotp);
      if (deleteotp) {
        console.log("successfull");
      }
    }, 3 * 60 * 1000);

    res
      .status(200)
      .send({ msg: "otp sent successfully", otp: otp, email: req.body.email });
  }
});
router.post("/validateotp", async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const findemail = await Reset.findOne({ email: email });

  if (findemail) {
    if (findemail.otp == otp) {
      res.status(200).send("otp validated");
    } else {
      res.status(200).send("otp incorrect");
    }
  }
});
router.post("/resetpass", async (req, res) => {
  const passowrd = req.body.password;
  const email = req.body.email;

  const update = await User.findOneAndUpdate(
    { email: email },
    { password: passowrd }
  );

  if (update) {
    res.status(200).send("password changed successfully");
  } else {
    res.status(200).send("some error occured");
  }
});

router.post("/refresh", async (req, res) => {
  const user_id = req.headers.authorization;

  const userDetails = await User.findById(user_id);

  if (userDetails) {
    var obj = {
      userid: userDetails._id,
      username: userDetails.username,
      profile: userDetails.profile,
      posts: userDetails.posts,
      followers: userDetails.followers,
      following: userDetails.following,
    };

    const updatedToken = jwt.sign(obj, "mysalt");
    res.status(200).send(updatedToken);
  }
});

router.post("/verifyphone", async (req, res) => {
  const apikey =
    "d01df3e104c69be8665171ea459da262-d066281c-c742-410f-8b24-71535d668ca7";
  console.log(req.body);
  const tophone = req.body.phone;
  let otp = Math.floor(Math.random() * 1000000);
  const msgbody = {
    messages: [
      {
        destinations: [
          {
            to: tophone,
          },
        ],
        from: "InfoSMS",
        text: "Your otp to verify is" + otp,
      },
    ],
  };

  const resp = await axios.post(
    "https://l3q912.api.infobip.com/sms/2/text/advanced",
    msgbody,
    {
      headers: {
        Authorization: "App " + apikey,
      },
    }
  );

  if (resp.status == 200) {
    console.log(resp.data);
    const phoneschema = {
      email: req.headers.authorization,
      otp: otp,
    };

    const otpschema = new Reset(phoneschema);
    const tempstoreotp = await otpschema.save();

    if (tempstoreotp) {
      setTimeout(async () => {
        console.log("came here");
        const deleteotp = await Reset.findByIdAndDelete(tempstoreotp._id);
        console.log(deleteotp);
        if (deleteotp) {
          console.log("successfull");
        }
      }, 3 * 60 * 1000);

      res.status(200).send("otp sent successfully");
    }
  }
});

router.post("/deactivate", async (req, res) => {
  const user = req.headers.authorization;

  const userData = await User.findById(user);

  //get the posts id's from here
  //get the following id from here and go to there profile and remove user from there follower
  // get the followers of this person and go to there profile and remove the user from there following
  let removefollower, removefollowing, removepost;
  userData.posts.forEach(async (elem) => {
    console.log("cam here");
    removepost = await Post.findByIdAndDelete(elem);
  });

  userData.following?.forEach(async (elem) => {
    removefollower = await User.findByIdAndUpdate(elem, {
      $pull: { followers: user },
    });
  });

  userData.followers?.forEach(async (elem) => {
    removefollowing = await User.findByIdAndUpdate(elem, {
      $pull: { following: user },
    });
  });

  const deleteuser = await User.findByIdAndDelete(user);
  res.status(200).send("thank you for using insta");
});
module.exports = router;
