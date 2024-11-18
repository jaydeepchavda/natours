const express = require("express");
const morgan = require('morgan')
const tourRouter = require('./dev-data/Routes/tourRoutes');
const userRouter = require('./dev-data/Routes/userRoutes')
const app = express();


// 1> middleware
app.use(morgan('dev'))

app.use(express.json());

app.use(express.static(`${__dirname}/public`))

// create own middleware
app.use((req,res,next)=>{
    console.log("hello from the middleware 👋👋");
    next();
})

// create own middleware for time 
app.use((req,res,next)=>{
     req.requestTime = new Date().toISOString();
    next();
})


// 2> ROUTE HANDLERS

// 3> ROUTES

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

// app.get("/api/v1/tours/:id", getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


// 4> START THE SERVER

module.exports = app;
