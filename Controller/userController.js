const User = require("./../Model/usersModel");

exports.getAllUser = (req, res) => {
  // res.status(200).json({
  //   status: "success",
  //   requestTime: req.date,
  //   result: user.length,
  //   data: {
  //     user,
  //   },
  // });
};
exports.getUserById = (req, res) => {
  // res.status(200).json({
  //   requiredUser,
  // });
};
exports.createNewUser = (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      addedData: newUser,
    },
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      users: "User is updated",
    },
  });
};
exports.deleteUser = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
