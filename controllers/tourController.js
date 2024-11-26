const fs = require('fs');
const Tour = require('../models/tourModel');
const { error } = require('console');
const { Query } = require('mongoose');

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

// top-5-cheap route handles logic
exports.aliasTopTours = (req, res, next) =>{
    req.query.limit='5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}

class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filter(){
        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);


        // 1B> Advance filtering
        let queryStr = JSON.stringify(queryObj);
        // Replace keywords like gte, gt, lte, lt with their MongoDB equivalents
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);


        this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else{
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
}

// route handlers
exports.getAllTours = async (req,res) => {
    try {
        console.log(req.query);

        // BUILD QUERY 
        // 1 A> filtering
        // const queryObj = {...req.query};
        // const excludedFields = ['page', 'sort','limit','fields'];
        // excludedFields.forEach(el => delete queryObj[el]);


        // // 1 B> Advance filtering
        // let queryStr = JSON.stringify(queryObj);
        // // Replace keywords like gte, gt, lte, lt with their MongoDB equivalents
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // let query = Tour.find(JSON.parse(queryStr));

        // 2> Sorting
        // if(req.query.sort){
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        // } else{
        //     query = query.sort('-createdAt')
        // }
        
        // 3> field limiting 
        if (req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            console.log(fields);
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }


        // 4> pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;
        
        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const numTours = await Tour.countDocuments();
            if ( skip >= numTours ) throw new Error('This page does not exits');
        }

        // EXUCUTE QUERY
        const features = new APIFeatures(Tour.find(),req.query).filter().sort();
        const tours = await features.query;

        // const tours = await query;

        // SEND RESPONSE
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
            message: err 
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
