const mongoose = require('mongoose');
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'A tour must have a name'],
        unique:true
    },
    slug: String,
    duration:{
        type:Number,
        required:[true,'A tour must have duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true, 'A true must have a group size']
    },
    difficulty:{
        type: String,
        required:[true, 'A tour must have a difficulty']
    },
    ratingAverage:{
        type: Number,
        default: 4.5
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount:Number,
    summary:{
        type: String,
        trim: true,
        required:[true, 'A tour must have a description summary']
    },
    description:{
        type: String,
        trim: true
    },
    imageCover:{
        type:String,
        required:[true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type : Boolean,
        default : false 
    }
},{
    toJSON: { virtuals: true},
    toObject : { virtuals: true }
});
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
})


// DOCUMENT MIDDLEWARE: runs before .save()  and .create()
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name , { lower : true})
    next();
})

// tourSchema.pre('save', function(next) {
//     console.log("this will save documents .........")
//     next();
// })

// tourSchema.post('save',function (doc,next) {
//     console.log(doc);
//     next();
// })




// QUERY MIDDLEWARE
// tourSchema.pre('find',function(next){
//     this.find({ secretTour:  { $ne : true} })
//     next();
// })
tourSchema.pre(/^find/,function(next){

    this.find({ secretTour:  { $ne : true} })
    this.start = Date.now();
    next();
})
tourSchema.post(/^find/,function(docs,next){
    console.log(`Query took ${Date.now() - this.start} milliseconds ...`)
    // console.log(docs);
    next();
})


// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate' ,function(next){
    this.pipeline().unshift({ $match: { secretTour: {$ne : true }}});
    console.log(this.pipeline());
    next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;