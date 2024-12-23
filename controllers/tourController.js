const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

const factory = require('./handlerFactory');

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



// route handlers

exports.getAllTours = catchAsync(async (req,res,next) => {

        // EXUCUTE QUERY
        const features = new APIFeatures(Tour.find(),req.query || {}).filter().sort().limitFields().paginate();
        const tours = await features.query;

        res.status(200).send({
            status:'success',
            results:tours.length,
            data:{
                tours
            }
        })
})

// exports.getAllTours = async (req,res) => {
//     try {
//         console.log(req.query);

//         // BUILD QUERY 
//         // 1 A> filtering
//         // const queryObj = {...req.query};
//         // const excludedFields = ['page', 'sort','limit','fields'];
//         // excludedFields.forEach(el => delete queryObj[el]);


//         // // 1 B> Advance filtering
//         // let queryStr = JSON.stringify(queryObj);
//         // // Replace keywords like gte, gt, lte, lt with their MongoDB equivalents
//         // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//         // let query = Tour.find(JSON.parse(queryStr));

//         // 2> Sorting
//         // if(req.query.sort){
//         //     const sortBy = req.query.sort.split(',').join(' ');
//         //     query = query.sort(sortBy);
//         // } else{
//         //     query = query.sort('-createdAt')
//         // }
        
//         // 3> field limiting 
//         // if (req.query.fields){
//         //     const fields = req.query.fields.split(',').join(' ');
//         //     console.log(fields);
//         //     query = query.select(fields);
//         // } else {
//         //     query = query.select('-__v');
//         // }


//         // 4> pagination
//         // const page = req.query.page * 1 || 1;
//         // const limit = req.query.limit * 1 || 10;
//         // const skip = (page - 1) * limit;
        
//         // query = query.skip(skip).limit(limit);

//         // if(req.query.page){
//         //     const numTours = await Tour.countDocuments();
//         //     if ( skip >= numTours ) throw new Error('This page does not exits');
//         // }

//         // EXUCUTE QUERY
//         const features = new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate();
//         const tours = await features.query;

//         // const tours = await query;

//         // SEND RESPONSE
//         res.status(200).send({
//             status:'success',
//             results:tours.length,
//             data:{
//                 tours
//             }
//         })
        
//     }
//     catch (err){
//         res.status(404).json({
//             status: "fail",
//             message: err
//         })
//     }

   
// }

exports.getTourStats = catchAsync(async (req, res,next) => {
        const stats = await Tour.aggregate([
            {
                $match: { ratingAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty'},
                    numTours: { $sum: 1},
                    numRating: { $sum: '$ratingsQuantity'},
                    avgRating: { $avg: '$ratingAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort :{ avgPrice: 1 }
            },
            {
                $match: { _id: { $ne: 'EASY' }}
            }
        ]);

        // console.log('Stats:', stats);

        res.status(200).json({
            status: 'success',
            data: { stats },
        });
});

exports.getTour = catchAsync(async (req,res,next) => {
        const tour = await Tour.findById(req.params.id).populate('reviews')

        if(!tour){
            return next(new AppError("No tour found with that ID..."),404)
        }
        res.status(200).send({
        status:"success",
        data:{
            tours: tour
        }
    })
})



// exports.createTour = catchAsync(async (req,res,next)=>{
//     const newTour = await Tour.create(req.body)

//         res.status(201).json({
//             status:"success",
//             data:{
//                 tour:newTour
//             }
//         })
// })

// exports.updateTour = catchAsync(async (req , res, next) => {
//         const tour = await Tour.findByIdAndUpdate(req.params.id, req.body , {
//             new:true,
//             runValidators:true
//         });
//         if(!tour){
//             return next(new AppError("No tour found with that ID..."),404)
//         }

//         res.status(200).json({
//             status:"success",
//             data:{
//                 tour
//             }
//         });  
// })


// exports.deleteTour = catchAsync(async (req , res, next)=>{
//         const tour = await Tour.findByIdAndDelete(req.params.id);

//         if(!tour){
//             return next(new AppError("No tour found with that ID..."),404)
//         }
        
//         res.status(204).json({
//             status:"success",
//             data:null
//         })  
// })

// factory function
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);



exports.getMonthlyPlan = catchAsync(async (req, res,next) =>{
        const year = req.params.year * 1; //2021
        const plan = await Tour.aggregate([
            {
                $unwind : '$startDates'
            },
            {
                $match : {
                    startDates: {
                        $gte : new Date(`${year}-01-01`),
                        $lte : new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group : {
                    _id : { $month : '$startDates'},
                    numTourStarts : { $sum : 1},
                    tours: { $push : '$name'}
                }
            },
            {
                $addFields : { month : '$_id'}
            },
            {
                    $project :{
                        _id: 0
                    }
            },
            {
                $sort : { numTourStarts : -1 }
            },
            {
                $limit: 12 
            }
        ])
            res.status(200).json({
            status:"success",
            data: {
                plan
            }
        });
})