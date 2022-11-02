const appError = require("../utils/appError");

const handleErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  const error = new appError(message, 400);
  return error;
};
const handleDublicateError = (err) => {
  const message = `Dublicate field value ${
    Object.values(err.keyValue)[0]
  } Please use another value`;
  return new appError(message, 400);
};
const handleVatidatorError = (err) => {
  const error = new appError(err.message, 400);
  return error;
};
const devError = (res, err) => {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    errStack: err.stack,
  });
};
const proError = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV == "development") {
    devError(res, err);
  }
  if (process.env.NODE_ENV == "production") {
    if (err.name == "CastError") {
      err = handleErrorDB(err);
    }
    if (err.code == 11000) err = handleDublicateError(err);
    if ((err.name = "ValidatorError")) err = handleVatidatorError(err);
    proError(res, err);
  }
};
