const express = require('express');
const authController = require('../controllers/auth.controller');
const authRouter = express.Router(); 

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/login-auth0', authController.loginAuth0);
module.exports = {authRouter}