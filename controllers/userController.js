const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync')

// route handlers
exports.getAllUsers =catchAsync(async (req,res)=>{
    const tours = await User.find();

    res.status(200).send({
        status:'success',
        results:tours.length,
        data:{
            tours
        }
    })
});

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

exports.updateUser = (req,res)=>{
    res.status(500).json({
        status:"error",
        message:"This route is not yet defined! ..👍"
    })
}

exports.deleteUser = (req,res)=>{
    res.status(500).json({
        status:"error",
        message:"This route is not yet defined! ..👍"
    })
}
