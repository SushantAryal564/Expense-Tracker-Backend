const mongoose = require("mongoose");
const expenseSchema = mongoose.Schema({
  user: Number,
  product: {
    type: String,
    required: [true, "To add to expense product should have name"],
  },
  price: {
    type: Number,
    required: [true, "What's the price of the product."],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});
const Expenses = mongoose.model("Expenses", expenseSchema);
module.exports = Expenses;
