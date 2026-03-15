const {Router}=require('express');
const { model } = require('mongoose');
const authController=require('../controllers/auth.controller');

const authRouter=Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);


/**
 * @route POST /api/auth/login
 * @description Login an existing user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

module.exports=authRouter;