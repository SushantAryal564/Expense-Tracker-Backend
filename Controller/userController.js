const { findByIdAndUpdate } = require("./../Model/usersModel");
const User = require("./../Model/usersModel");
exports.aliasNewUser = (req, res, next) => {
  req.query.sort = "created_at";
  req.query.limit = "3";
  next();
};
exports.getAllUser = async (req, res) => {
  try {
    /// Simple Filtering
    console.log(req.query);
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "filed"];
    excludeField.forEach((el) => delete queryObj[el]);
    /// Advance Filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryString = JSON.parse(queryString);
    const query = User.find(queryString);
    // Sorting
    if (req.query.sorts) {
      const sortby = req.query.sorts.split(",").join(" ");
      query.sort(sortby);
    } else {
      query.sort("-created_at");
    }
    // Limiting
    if (req.query.fields) {
      const limitTo = req.query.fields.split(",").join(" ");
      query.select(limitTo);
    } else {
      query.select("-__v");
    }
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);
    if (req.query.page) {
      const numUser = User.countDocuments();
      if (skip >= numUser) throw new Error("This page doesn't exists.");
    }

    const user = await query;
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
