const User = require("../Model/usersModel");
const Expense = require("./../Model/expensesModel");
exports.aliasTopExpenses = (req, res, next) => {
  req.query.limit = 5;
  req.query.find = "sort=price";
  req.query.fields = "user,product,price";
  next();
};
exports.getAllExpenses = async (req, res) => {
  try {
    // Simple Filtering
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "filed"];
    excludeField.forEach((el) => delete queryObj[el]);
    // Advance Filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryString = JSON.parse(queryString);
    let query = Expense.find(queryString);
    // Sorting
    if (req.query.sort) {
      const sortby = req.query.sort.split(",").join(" ");
      query.sort(sortby);
    } else {
      query.sort("-price");
    }
    // Limiting
    if (req.query.fields) {
      const limitTo = req.query.fields.split(",").join(" ");
      query.select(limitTo);
    } else {
      query.select("-__v");
    }
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numExpenses = await User.countDocuments();
      if (skip >= numExpenses) throw new Error("This page doesn't exists.");
    }
    const expenses = await query;
    res.status(200).json({
      status: "success",
      totalResult: expenses.length,
      data: {
        expenses,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getExpensesById = async (req, res) => {
  try {
    const user = await Expense.findById(req.param.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
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
