const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el =>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

// route handlers
exports.getAllUsers = catchAsync(async (req,res,next)=>{
    const tours = await User.find();

    res.status(200).send({
        status:'success',
        results:tours.length,
        data:{
            tours
        }
    })
});


exports.updateMe =catchAsync(async(req,res,next) =>{
    // 1> create error is user posts password data
    if(req.body.password ||req.body.passwordConfirm){
        return next(new AppError("This route is not for password updates. Please use /updateMyPassowrd." , 400));
    }


    // 2> Filetered out unwanted fields name that are not allowed to be updated
    const filterBody = filterObj(req.body, 'name','email');

    // 3> Update user Document  
    const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new:true,
        runValidators:true
    })
    res.status(200).json({
        status:"success",
        data:{
            user:updateUser
        }
    });
});
exports.deleteMe = catchAsync(async (req,res,next) => {
    await User.findByIdAndUpdate(req.body.id,  { active : false } );

    res.status(204).json({
        status : "success",
        data: null
    })
})

exports.getUser = (req,res)=>{
    res.status(500).json({
        status:"error",
        message:"This route is not yet defined! ..👍"
    })
}

exports.createUser = (req,res)=>{
    res.status(500).json({
        status:"error",
        message:"This route is not yet defined! ..👍"
    })
}

// exports.updateUser = (req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet defined! ..👍"
//     })
// }
 


// exports.deleteUser = (req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet defined! ..👍"
//     })
// }

// issue solved in factory function 

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User)