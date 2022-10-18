const express = require("express");
const { router } = require("../app");
const Router = express.Router();
const userController = require("./../Controller/userController");
Router.route("/")
  .get(userController.getAllUser)
  .post(userController.createNewUser);
Router.route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = Router;
