const express = require("express");
const Router = express.Router();
const expenseController = require("./../Controller/expenseController");
Router.route("/expensiveExpenses").get(
  expenseController.aliasTopExpenses,
  expenseController.getAllExpenses
);
Router.route("/")
  .get(expenseController.getAllExpenses)
  .post(expenseController.createExpense);
Router.route("/:id")
  .get(expenseController.getExpensesById)
  .delete(expenseController.deleteExpense)
  .patch(expenseController.updateExpense);
module.exports = Router;
