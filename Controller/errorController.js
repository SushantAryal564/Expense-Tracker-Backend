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
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err);
  if (process.env.NODE_ENV == "development") {
    devError(res, err);
  }
  if (process.env.NODE_ENV == "production") {
    devError(res, err);
  }
};
