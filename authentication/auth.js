const { User } = require("../models/user/users");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

require("../database/mongoose");

router.post("/", async (req, res) => {
  let user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(400).send("Invalid Email");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
