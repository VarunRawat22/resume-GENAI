const {Router}=require('express');
const { model } = require('mongoose');
const authController=require('../controllers/auth.controller');
const authMiddleware=require('../middlewares/auth.middleware');

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
authRouter.get("/login", authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add token in the blacklist
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController);

//API- /get-me is route pe hum current logged in user ki details fetch karenge, iske liye token ki jarurat hogi jo cookie me hoga, token ko verify karne ke baad hi user ki details bhejni hai, agar token invalid hua to error bhejna hai, agar token valid hua to user ki details bhejni hai
/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details, requires token in the cookie
 * @access Public
 */

authRouter.get("/get-me", authMiddleware.authUser,authController.getMeController); 

module.exports=authRouter;