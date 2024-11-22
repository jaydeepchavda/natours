const mongoose = require('mongoose');


const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'A tour must have a name'],
        unique:true
    },
    duration:{
        type:number,
        required:[true,'A tour must have duration']
    },
    maxGroupSize:{
        type:number,
        required:[true, 'A true must have a group size']
    },
    ratingAverage:{
        type: Number,
        default: 4.5
    },
    ratingsQuantity:{
        type:number,
        default:0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount:number,
    summery:{
        type: String,
        trim: true,
        required:[true, 'A tour must have a description']
    },
    description:{
        type: String,
        trim: true
    },
    imageCover:{
        type:String,
        required:[true, 'A tour must have a cover image']
    },
    image: [String],
    createdAt:{
        type: Date,
        default:Date.now()
    },
    startDate: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;