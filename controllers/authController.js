const JWT = require('jsonwebtoken');
const User  = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')


exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body);
    const token = JWT.sign({id:newUser._id},process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRES_IN
    })


    res.status(201).json({
        status:'success',
        token,
        data: {
            user : newUser
        }
    })
});