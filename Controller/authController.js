const catchAsync = require("./../utils/catchAsync");
const User = require("./../Model/usersModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const appError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
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

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new appError("You aren't logged in ", 401));
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JSON_WEBTOKEN_SECRET
  );

  // 3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    new appError(
      "The user beloniging to this token doesn't longer exists.",
      401
    );
  }
  // 4) Check if use changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    new appError("User recently changed password! Please log in again", 401);
  }
  // Grant access
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        new appError("You don't have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError("There is no user with email address", 404));
  }
  // 2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetURL = `${req.protocal}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forget your password? Submit a patch with your new password and passwordConfirm to:${resetURL}\n If you didn't forget your password pleasae ignore this email!`;
  try {
    sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for 10 min)`,
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError("There was an error sending the email, Try again later!")
    );
  }
});
exports.resetPassword = (req, res, next) => {};
