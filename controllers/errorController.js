const AppError = require('./../utils/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}
const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value)
  const message =`Duplicate field value: ${value}. Please use another value`
  return new AppError(message, 400)
}


const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el = el.message);

  const message = `Invalide input data. ${errors.join('. ')} `;
  return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid Token , please login again',401);
const handleJWTExpiredToken = () => new AppError('your taken has been expired! Please log in again',401);
const sendErrorDev = (err,res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack:err.stack
      });
}

const sendErrorProd = (err, res) => {
    // operational , trusted error : send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
          });    
    }
    // programming or other unknown error : dont leak error details
    else {

        // 1> log error
        console.error('error' , err)

        // 2> send generic message
        res.status(500).json({
            status: 'error',
            message: "something went very wrong..."
        })
    }
    
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV ==='development') {
    sendErrorDev(err,res); 
  }
  else if(process.env.NODE_ENV === "production") {
    let error = {...err};
    
    if(error.name === 'castError') error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    if(error.name === 'validationError') error = handleValidationErrorDB(error);
    if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if(error.name === 'TokenExpiredError') error = handleJWTExpiredToken(error);
    sendErrorProd(error,res);
  }
  
};