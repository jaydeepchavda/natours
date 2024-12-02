const JWT = require('jsonwebtoken');
const User  = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');


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

exports.login = catchAsync(async (req, res, next) => {
    const { email , password } = req.body;

    // 1> check if email and password are exist
    if(!email || !password){
      return next(new appError("Please provide email and password ", 400));
    }
    // 2> check if user exits and password is correct
    const user = await User.findOne({email}).select('+password')

    console.log(user)
    // 3> if everything ok send token to client
    const token = " ";
    res.status(200).json({
        status:"success",
        token 
    })

})