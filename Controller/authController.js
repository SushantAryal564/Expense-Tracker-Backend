const catchAsync = require("./../utils/catchAsync");
const User = require("./../Model/usersModel");

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: "success",
    user: newUser,
  });
});
