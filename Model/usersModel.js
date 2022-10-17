const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must provide your name"],
    trim: true,
    maxlength: [40, "Allowed maximum lenght of name is less than 40"],
    minlength: [10, "Allowed minimum length of name is more than 10"],
  },
  email: {
    type: String,
    required: [true, "You must provide your emailaddress"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
