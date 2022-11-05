const catchAsync = require("./../utils/catchAsync");
const User = require("./../Model/usersModel");
const jwt = require("jsonwebtoken");
const appError = require("./../utils/appError");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JSON_WEBTOKEN_SECRET, {
    expiresIn: process.env.JSON_WEBTOKEN_EXPIRES,
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    email: req.body.email,
    name: req.body.name,
    age: req.body.age,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    created_at: req.body.created_at,
  });
  const token = signToken(newUser._id);
  res.status(200).json({
    status: "success",
    token,
    user: newUser,
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("Please enter email and passowrd", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.passwordCorrect(password, user.password))) {
    return next(new appError("Incorrect email or password", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
