const catchAsync = require("./../utils/catchAsync");
const User = require("./../Model/usersModel");
const jwt = require("jsonwebtoken");
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    email: req.body.email,
    name: req.body.name,
    age: req.body.age,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    created_at: req.body.created_at,
  });
  const token = jwt.sign({ id: this._id }, process.env.JSON_WEBTOKEN_SECRET, {
    expiresIn: process.env.JSON_WEBTOKEN_EXPIRES,
  });
  res.status(200).json({
    status: "success",
    token,
    user: newUser,
  });
});
