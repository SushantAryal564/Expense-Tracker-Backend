const User = require("../Model/usersModel");
const APIFeatures = require("./../utils/apiFeatures");
const Expense = require("./../Model/expensesModel");
const catchAsync = require("./../utils/catchAsync.js");
const appError = require("./../utils/appError");

exports.aliasTopExpenses = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "price";
  req.query.fields = "user,product,price";
  next();
};

exports.getAllExpenses = catchAsync(async (req, res, next) => {
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
});
exports.getExpensesById = catchAsync(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    return next(new appError("Invalid request there is no requested ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      expense,
    },
  });
});

exports.deleteExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) {
    return next(new appError("Invalid request there is no requested ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateExpense = catchAsync(async (req, res, next) => {
  console.log(req.params.id, req.body);
  const updateExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!updateExpense) {
    return next(new appError("Invalid request there is no requested ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      updateExpense,
    },
  });
});

exports.createExpense = catchAsync(async (req, res, next) => {
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
});

exports.getExpenseStats = catchAsync(async (req, res, next) => {
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
});
