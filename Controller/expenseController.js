const User = require("../Model/usersModel");
const APIFeatures = require("./../utils/apiFeatures");
const Expense = require("./../Model/expensesModel");
exports.aliasTopExpenses = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "price";
  req.query.fields = "user,product,price";
  next();
};

exports.getAllExpenses = async (req, res) => {
  try {
    const feature = new APIFeatures(Expense.find(), req.query)
      .filter()
      .sort()
      .limitField()
      .pagination();
    const expenses = await feature.query;
    res.status(200).json({
      status: "success",
      result: expenses.length,
      data: {
        expenses,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.getExpensesById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.param.id);
    res.status(200).json({
      status: "success",
      data: {
        expense,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
exports.updateExpense = async (req, res) => {
  try {
    console.log(req.params.id, req.body);
    const updateExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        updateExpense,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
exports.createExpense = async (req, res) => {
  try {
    console.log(req.body);
    const newExpense = await Expense.create(req.body);
    // this is similar to
    // const newExpense = new Expense({});
    // newExpense.save();
    res.status(201).json({
      status: "success",
      data: {
        expense: newExpense,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent.",
    });
  }
};
exports.getExpenseStats = async (req, res) => {
  try {
    const ExpenseStats = await Expense.aggregate([
      {
        $group: {
          _id: "$user",
          num: { $sum: 1 },
          totalExpense: { $sum: "$price" },
          miniumExpense: { $min: "$price" },
          maximumExpense: { $max: "$price" },
          averageExpense: { $avg: "$price" },
        },
      },
      {
        $sort: {
          miniumExpense: -1,
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      ExpenseStats,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
