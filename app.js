const express = require("express");
const app = express();
const morgan = require("morgan");
const userRouter = require("./Routes/userRoute");
const expenseRouter = require("./Routes/expenseRoute");
if (process.env.NODE_ENV == "developement") {
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  console.log("Welcome from the global middleware");
  next();
});
app.use(express.json());
app.use((req, res, next) => {
  const date = new Date().toISOString();
  req.date = date;
  next();
});
app.use("/api/expenses", expenseRouter);
app.use("/api/user", userRouter);
module.exports = app;
