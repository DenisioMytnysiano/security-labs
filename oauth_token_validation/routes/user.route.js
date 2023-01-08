const express = require('express');
const userController = require("../controllers/user.controller");
const userRouter = express.Router(); 
const oauthMiddleware = require("../middleware/oauth/oauth.middleware");

userRouter.use(oauthMiddleware);
userRouter.get("/me", userController.me);

module.exports = {userRouter}

