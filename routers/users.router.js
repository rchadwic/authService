const express = require('express');
const userRoutes = new express.Router();
const userController = require('../controllers/users.controller.js')


userRoutes.post("/create",userController.create);
userRoutes.get("/me",userController.me);
userRoutes.delete("/:id",userController.delete);
userRoutes.patch("/:id",userController.update);
userRoutes.get("/:id",userController.get);
module.exports = userRoutes;
