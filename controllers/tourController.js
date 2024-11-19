const fs = require('fs');
const Tour = require('../models/tourModel')

// reading file sync


// middleware


exports.checkID =(req,res,next,val)=>{
    console.log(`Tour id is : ${val}`);
    if(req.params.id * 1 > tours.length-1){
        return res.status(404).json({
            status:"fail",
            message:"Invalid ID"
        })
    }
    next();
}
exports.checkBody = (req,res,next)=>{
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status:'Bad Request',
            message:"Missing name or price!... "
        })
    }
    next();
}
// route handlers
exports.getAllTours = (req,res)=>{
    console.log(req.requestTime);
    res.status(200).send({
        status:'success',
        requestedAt: req.requestTime,
        // results:tours.length,
        // data:{
        //     tours
        // }
    })
}

exports.getTour = (req,res)=>{
    // console.log(req.params);
    const id = req.params.id *1;
    // const tour = tours.find(el => el.id === id);


    // res.status(200).send({
    //     status:"success",
    //     data:{
    //         tours: tour
    //     }
    // })
}

exports.createTour = (req,res)=>{
    res.status(201).json({
        status:"success",
        // data:{
        //     tour:newTour
        // }
    })
}

exports.updateTour = (req , res)=>{
    res.status(200).json({
        status:"success",
        data:{
            tour:'<updated tour here ....>'
        }
    })
}

exports.deleteTour = (req , res)=>{
    
    res.status(204).json({
        status:"success",
        data:null
    })
}
