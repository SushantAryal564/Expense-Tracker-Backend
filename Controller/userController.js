const APIFeatures = require("../utils/apiFeatures");
const { findByIdAndUpdate } = require("./../Model/usersModel");
const User = require("./../Model/usersModel");
exports.aliasNewUser = (req, res, next) => {
  req.query.sort = "created_at";
  req.query.limit = "3";
  next();
};
exports.getAllUser = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.createNewUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
exports.getuserStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
