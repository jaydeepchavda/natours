const express = require("express");
const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController'); 
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes')
const app = express();


// - 200 OK: Request succeeded
// - 201 Created: Resource created
// - 202 Accepted: Accepted request
// - 204 No Content: Accepted request
// - 301 Moved Permanently: Accepted request
// - 302 Found: Temporarily moved
// - 304 Not Modified: Not modified
// - 400 Bad Request: Bad request error
// - 401 Unauthorized: Needs authentication
// - 403 Forbidden: Access Forbidden
// - 404 Not Found: Resource Not Found
// - 405 Not Allowed: Method not allowed
// - 408 Request Timeout: Request timed out
// - 500 Internal Server Error: Server error
// - 501 Not Implemented: Not implemented
// - 502 Bad Gateway: Bad gateway error
// - 503 Service Unavailable: Service unavailable
// - 504 Gateway Timeout: Gateway Timeout

// 1> middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))

}

app.use(express.json());

app.use(express.static(`${__dirname}/public`))

// create own middleware
// app.use((req,res,next)=>{
//     console.log("hello from the middleware 👋👋");
//     next();
// })

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

// unhandle routes
app.all('*',(req,res,next) =>{
    // res.status(404).json({
    //     status: "fail",
    //     message: `can't find ${req.originalUrl} on this server`
    // })
    // const err = new Error( `can't find ${req.originalUrl} on this server! `);
    // err.status = "fail",
    // err.statusCode = 404;

    next(new AppError(`can't find ${req.originalUrl} on this server! `, 404));

})

app.use(globalErrorHandler)


// 4> START THE SERVER

module.exports = app;
