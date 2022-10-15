const express = require("express");
const Router = express.Router();
const expenseController = require("./../Controller/expenseController");
Router.route("/").get(expenseController.getAllExpenses);
module.exports = Router;
