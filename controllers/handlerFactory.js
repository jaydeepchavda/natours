const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// exports.deleteOne = Model => catchAsync(async (req , res, next)=>{
//     const doc = await Model.findByIdAndDelete(req.params.id);

//     if(!doc){
//         return next(new AppError("No Document found with that ID..."),404)
//     }
    
//     res.status(204).json({
//         status:"success",
//         data:null
//     })  
// })

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError("No Document found with that ID...", 404));
    }

    res.status(204).json({
        status: "success",
        data: null
    });
});


exports.updateOne =  Model => catchAsync(async (req , res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body , {
        new:true,
        runValidators:true
    });
    if(!doc){
        return next(new AppError("No document found with that ID..."),404)
    }

    res.status(200).json({
        status:"success",
        data:{
            data: doc
        }
    });  
});

exports.createOne = Model => catchAsync(async (req,res,next)=>{
        const doc = await Model.create(req.body)
    
            res.status(201).json({
                status:"success",
                data:{
                    data : doc
                }
            })
    })


exports.getOne = (Model, popOption) => catchAsync(async (req,res,next) => {
    let  query = Model.findById(req.params.id);
    if(popOption) query = query.populate(popOption);
    const doc = await query;

    if(!doc){
        return next(new AppError("No document found with that ID..."),404)
    }

    res.status(200).send({
    status:"success",
    data:{
        tours: doc
    }
})
})

// exports.deleteTour = catchAsync(async (req , res, next)=>{
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if(!tour){
//         return next(new AppError("No tour found with that ID..."),404)
//     }
    
//     res.status(204).json({
//         status:"success",
//         data:null
//     })  
// })