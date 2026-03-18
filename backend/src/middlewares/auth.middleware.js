const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

async function authUser(req,res,next){
    const token=req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized, token is missing"
        });
    }

    const isTokenBlacklisted= await tokenBlacklistModel.findOne({token});

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Unauthorized, token is invalid"
        });
    }

    try{
    const decoded= jwt.verify(token,process.env.JWT_SECRET);

    req.user=decoded; // decoded me user ki details hongi jo token banate time dali thi, usko req.user me store kar denge taki aage ke controllers me use kar sake

    next();
    }catch(err){
        return res.status(401).json({
            message: "Invalid Token!"
        });
    }
}

module.exports={authUser};