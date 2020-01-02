const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let status, response;

  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400).json("No User");
    throw new Error("User does not exist");
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    res.status(400).json("Incoract Password");
    throw new Error("Password is Incorrect!");
  }
  console.log("is Equal");
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email
    },
    process.env.BCRYPT_SALT,
    { expiresIn: "1h" }
  );
  res.status(200).json({
    userId: user.id,
    token: token,
    tokenExpiration: 1
  });
});

//zzzz

module.exports = router;
