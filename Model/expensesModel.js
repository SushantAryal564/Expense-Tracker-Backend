const mongoose = require("mongoose");
const slugify = require("slugify");
const expenseSchema = mongoose.Schema(
  {
    user: mongoose.Schema.ObjectId,
    slug: String,
    productType: {
      type: String,
    },
    secretExpense: Boolean,
    product: {
      type: String,
      required: [true, "To add to expense product should have name"],
    },
    price: {
      type: Number,
      required: [true, "What's the price of the product."],
      validate: {
        validator: function (val) {
          return val > 0;
        },
        message: "Price should be greater than 0",
      },
    },
    Date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Virtual Properties
expenseSchema.virtual("expenseInRupee").get(function () {
  return this.price * 130;
});
// Document Middleware
expenseSchema.pre("save", function (next) {
  this.slug = slugify(this.productType, { lower: true });
  next();
});
// Query Middleware
expenseSchema.pre(/^find/, function (next) {
  this.find({ secretExpense: { $eq: true } });
  next();
});
// Aggrigation Middlewaare
expenseSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretExpense: { $ne: true } } });
});
const Expenses = mongoose.model("Expenses", expenseSchema);
module.exports = Expenses;
