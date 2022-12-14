const express = require("express");
const { router } = require("../app");
const Router = express.Router();
const userController = require("./../Controller/userController");
const authController = require("./../Controller/authController");
Router.post("/signup", authController.signUp);
Router.post("/login", authController.login);

Router.post("/forgetPassword", authController.forgetPassword);
Router.patch("/resetPassword/:token", authController.resetPassword);

Router.route("/userStats").get(userController.getuserStats);
Router.route("/newUsers").get(
  userController.aliasNewUser,
  userController.getAllUser
);
Router.route("/")
  .get(userController.getAllUser)
  .post(userController.createNewUser);
Router.route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser
  );

module.exports = Router;
