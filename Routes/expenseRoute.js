const express = require("express");
const Router = express.Router();
const expenseController = require("./../Controller/expenseController");
const authController = require("./../Controller/authController");
Router.route("/expenseStats").get(expenseController.getExpenseStats);
Router.route("/expensiveExpenses").get(
  expenseController.aliasTopExpenses,
  expenseController.getAllExpenses
);
Router.route("/")
  .get(authController.protect, expenseController.getAllExpenses)
  .post(expenseController.createExpense);
Router.route("/:id")
  .get(expenseController.getExpensesById)
  .delete(expenseController.deleteExpense)
  .patch(expenseController.updateExpense);
module.exports = Router;
