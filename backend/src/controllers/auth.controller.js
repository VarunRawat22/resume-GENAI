const userModel=require('../models/user.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const tokenBlacklistModel=require('../models/blacklist.model');


/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @param {*} req 
 * @param {*} res 
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Username, email and password are required" });
    }

    const ifUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }] 
        });
    if (ifUserAlreadyExists) {
        return res.status(400).json({
            message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user= await userModel.create({
        username,
        email,
        password: hashedPassword
    });

    const token=jwt.sign({ 
        id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );

    res.cookie("token", token);
    
    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        });
}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @param {*} req 
 * @param {*} res
 * @access Public 
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;
    // check kr rhe ki provided email se user exist krta hai ya nhi
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password" });
    }
    // agar email exist krta h toh password check krna pdega, provided password ko hashed password se compare krna hoga
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password" });
    }
    // agar password bhi valid h toh token generate krna hoga
    const token=jwt.sign({ 
        id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );
    res.cookie("token", token);
    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        });
    
}

async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if(token){
        await tokenBlacklistModel.create({ token });
    }
    res.clearCookie("token");
    return res.status(200).json({
        message: "User logged out successfully"
    });
}

/**
 * @name getMeController
 * @description get the current loggedin user detail
 * @access Public
 */
async function getMeController(req, res) {
    const user= await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

module.exports={registerUserController,
    loginUserController,
    logoutUserController,
    getMeController};