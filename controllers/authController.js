const { promisify } = require('util');
const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const User  = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const { token } = require('morgan');

const signToken = id => {
    return JWT.sign({ id },process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}


// create new function for send token

const createSendToken = (user,statusCode ,res) => {
    const token = signToken(user._id);


    res.status(statusCode).json({
        status:'success',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body);


    // replace token and res.status with createSentToken function
    createSendToken(newUser,201,res);
    // const token = signToken(newUser._id);


    // res.status(201).json({
    //     status:'success',
    //     token,
    //     data: {
    //         user : newUser
    //     }
    // })
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
    // replace token and res.status with createSentToken
    createSendToken(user,200,res);
    // const token = signToken(user._id);
    // res.status(200).json({
    //     status:"success",
    //     token 
    // })

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

exports.restrtictTo = (...roles) => {
    // roles ['admin','led-guide'].  role = 'user'
    return(req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new appError("you do not have persmission to perform this action",403));
        }
        next();
    }
}


exports.forgotPassword = catchAsync( async (req,res,next) =>{
    // 1>get user based on posted email
    const user = await User.findOne({ email : req.body.email});
    if(!user){
        return next(new  appError("there is no user with this email address.", 404) );
    }

    // 2>generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false });

    // 3>Send it to users token
    const resetURL =   `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}. 
    \nIf you didn't forget your password, please ignore this email.`

    try{
        await sendEmail({
            email: user.email,
            subject: 'your password reset token (valid for 10 min),',
            message
        })
    
        res.status(200).json({
            status:'success',
            message:'Token sent to email!'
        })
    }catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined; 
        await user.save({validateBeforeSave: false });

        return next(new appError('There was an error sending  the email. try again later!'), 500)
    }
    
});


exports.resetPassword = catchAsync(async (req,res,next) => {
    // 1> get user based on the token 
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken:hashedToken,passwordResetExpires: { $gt : Date.now()} } )
    // 2> if taken has not expires, and there is user, set the new password
    if(!user){
        return next(new appError('Token is invalid or has expired', 400))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); 
    // 3> update changedPasswordAt property for the user
    // 4> log the user in send jwt
    // replace token by createSentToken

    createSendToken(user,200,res);
    // const token = signToken(user._id);
    // res.status(200).json({
    //     status:"success",
    //     token 
    // })
});


exports.updatePassword =catchAsync(async (req,res,next) => {
    // 1> Get user from collection
     const user = await User.findById(req.user.id).select('+password')

    // 2> Check if POSTed current password is correct
    if(!(await user.correctPassword(req.body.passwordConfirm, user.password) ) ){
        return next(new appError('your current password is wrong. ',401))
    }


    // 3> if so update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();


    // 4> Log user in, send JWT
    createSendToken(user, 200, res);
})