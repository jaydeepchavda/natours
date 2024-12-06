const { promisify } = require('util');
const JWT = require('jsonwebtoken');
const User  = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

const signToken = id => {
    return JWT.sign({ id },process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);


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
 
    if(!user || !await user.correctPassword(password, user.password)){
        return next(new appError('Incorrect email or password', 401));
    }    

    // 3> if everything ok send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status:"success",
        token 
    })

})

exports.protect = catchAsync(async (req, res, next) => { 
    // 1> Get token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log('Headers:', req.headers);
    // console.log('Token:', token);
    if (!token) {
        return next(new appError('You are not logged in! Please log in to get access.', 401));
    }

    // 2> varification token
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    // 3> check if user still exist
    const currentUser = await User.findById(decoded.id);

    if(!currentUser){
        return next(new appError('The user belonging to this token does no longer does  exits',401));
    }
    // 4> check if user changed password after token was issued right
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new appError('user recently changed password! please log in again. ', 401) )
    }

    // grant access to protected route
    req.user = currentUser
    next();

})