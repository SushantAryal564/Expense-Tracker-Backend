const mongoose = require("mongoose");
const slugify = require("slugify");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide your name"],
      trim: true,
      maxlength: [40, "Allowed maximum lenght of name is less than 40"],
      minlength: [10, "Allowed minimum length of name is more than 10"],
    },
    slug: String,
    email: {
      type: String,
      required: [true, "You must provide your emailaddress"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    age: {
      type: Number,
      required: [true, "Please enter user age"],
      validate: {
        validator: function (val) {
          return val > 0 && val < 100;
        },
        message: "Age shoudl be greater than 0 and less than 110",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Virtual Properties
userSchema.virtual("UserSince").get(function () {
  const ageDate = new Date(new Date() - this.created_at);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});
// Document Middleware
userSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
