const fs = require('fs');
const Tour = require('../models/tourModel')

// reading file sync


// middleware


// exports.checkID =(req,res,next,val)=>{
//     console.log(`Tour id is : ${val}`);
//     if(req.params.id * 1 > tours.length-1){
//         return res.status(404).json({
//             status:"fail",
//             message:"Invalid ID"
//         })
//     }
//     next();
// }


// exports.checkBody = (req,res,next)=>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status:'Bad Request',
//             message:"Missing name or price!... "
//         })
//     }
//     next();
// }


// route handlers
exports.getAllTours = async (req,res) => {
    try{
    const tours = await Tour.find();
    res.status(200).send({
        status:'success',
        results:tours.length,
        data:{
            tours
        }
    })
        
    }
    catch (err){
        res.status(404).json({
            status: "fail",
            message: err
        })
    }

   
}

exports.getTour = async (req,res) => {
    // console.log(req.params);
    try{
        const tour = await Tour.findById(req.params.id);
    res.status(200).send({
        status:"success",
        data:{
            tours: tour
        }
    })
    }
    catch (err)
    {
        res.status(404).json({
            status:"fail",
            message: err
        })
    }

    
}

exports.createTour = async (req,res)=>{
    try{
        const newTour = await Tour.create(req.body)

        res.status(201).json({
            status:"success",
            data:{
                tour:newTour
            }
        })
    } catch (err) {
        console.log(err); // Add this to debug
        res.status(400).json({
            status:"fail",
            message:"invalid data sent!" 
        })
    }
    
}

exports.updateTour = async (req , res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body , {
            new:true,
            runValidators:true
        });

        res.status(200).json({
            status:"success",
            data:{
                tour
            }
        });

    }catch(err){
        res.status(404).json({
            status:"fail",
            message: err
        })
    }
    
}

exports.deleteTour = async (req , res)=>{
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id )

        res.status(204).json({
            status:"success",
            data:null
        })
    }catch(err){
        res.status(404).json({
            status:"fail",
            message: err
        })
    }
    
}
