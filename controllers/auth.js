const User = require('../models/User');
const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


//@desc     Register user
//@route    Post /api/v1/auth/register
//@access   Public
exports.register = asyncHandler(async(req, res, next)=>{
    const {name, email,mobile, password, role} = req.body;
    //Create user
    const user = await User.create({
        name,email,mobile,password,role
    });
    sendTokenResponse(user,200,res);
});

//@desc     Login user
//@route    Post /api/v1/auth/login
//@access   Public
exports.login = asyncHandler(async(req, res, next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorResponse('Please Provide an email & password', 400));
    }
     //check for user
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return next( new ErrorResponse('Invalid Credentials', 401));
    }

    //check if password matches
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return next( new ErrorResponse('Invalid Credentials', 401));
    }

    sendTokenResponse(user,200,res);
});

//@desc     Get Current loggedin user
//@route    Get /api/v1/auth/me
//@access   Private

exports.getMe = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data: user
    })
})

//@desc     Logout the user / clear cookie
//@route    Get /api/v1/auth/logout
//@access   Private

exports.logout = asyncHandler(async (req, res, next)=>{
    res.cookie('token','none',{
        expires:new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        success:true,
        data: {}
    })
})




//Get Token from model, create cookie and send response
const sendTokenResponse = (user,statusCode,res)=>{
    //create Token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }

    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token
    })
}