const express = require("express");
const morgan = require("morgan");
const userRouter = require("./Routes/userRoute");
const expensesRouter = require("./Routes/expenseRoute");
const app = express();
// Global Middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("tiny"));
}
app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello from the middleware.");
  next();
});
app.use("/api/expenses", expensesRouter);
// app.use("api/user", userRouter);
module.exports = app;
