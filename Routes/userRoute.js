const express = require("express");
const { router } = require("../app");
const Router = express.Router();
const userController = require("./../Controller/userController");
Router.param("id", userController.checkId);
Router.route("/")
  .get(userController.getAllUser)
  .post(userController.checkBody, userController.createNewUser);
Router.route("/:id").get(userController.getUserById);
module.exports = Router;
