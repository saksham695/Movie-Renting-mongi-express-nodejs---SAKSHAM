const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("user", userSchema);

const validateUser = (user) => {
  const schema = {
    name: joi.string().min(4).max(50).required(),
    email: joi.string().min(5).max(100).required().email(),
    password: joi.string().min(6).max(50).required(),
    isAdmin: joi.boolean(),
  };
  return joi.validate(user, schema);
};

module.exports.User = User;
module.exports.validateUser = validateUser;
