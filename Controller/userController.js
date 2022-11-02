const APIFeatures = require("../utils/apiFeatures");
const User = require("./../Model/usersModel");
const catchAsync = require("./../utils/catchAsync");
exports.aliasNewUser = (req, res, next) => {
  req.query.sort = "created_at";
  req.query.limit = "3";
  next();
};
exports.getAllUser = catchAsync(async (req, res) => {
  const featuer = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitField()
    .pagination();
  const users = await featuer.query;
  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});
exports.getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.createNewUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
  });
});
exports.updateUser = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
exports.getuserStats = catchAsync(async (req, res) => {
  console.log("Hi I am here");
  const userStat = await User.aggregate([
    {
      $group: {
        _id: null,
        TotalUser: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      userStat,
    },
  });
});
