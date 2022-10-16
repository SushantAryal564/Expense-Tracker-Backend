const fs = require("fs");
const user = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/users.json`));
exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > user.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name) {
    return res.status(404).json({
      status: "fail",
      message: "Missing name or age",
    });
  }
  next();
};
exports.getAllUser = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.date,
    result: user.length,
    data: {
      user,
    },
  });
};
exports.getUserById = (req, res) => {
  const id = +req.params.id;
  const requiredUser = user.find((user) => user.id == id);
  res.status(200).json({
    requiredUser,
  });
};
exports.createNewUser = (req, res) => {
  const newUserId = user[user.length - 1].id + 1;
  const newUser = Object.assign({ id: newUserId }, req.body);
  user.push(newUser);
  fs.writeFile(
    `${__dirname}/../../dummydata.json`,
    JSON.stringify(user),
    "utf-8",
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          addedData: newUser,
        },
      });
    }
  );
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
