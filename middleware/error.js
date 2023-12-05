const ErrorResponse = require("../utils/errorResponse");


const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err);


    // Mongoose Bad Object Id
    if (err.name === "CastError"){
        console.log(err.name);  
        // const message = `Resource not found with id of ${err.value}`;
        const message = "Resource not found";
        error = new ErrorResponse(message , 404);
    };


    // Mongoose Duplicate Key
    if (err.code === 11000){
        console.log(`Error Name : ${err.name}, Error Code : ${err.code}`);
        const message  = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    };


    // Mongoose Validation Error
    if (err.name === "ValidationError"){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    };


    res.status(error.statusCode || 500).json({
        success : false,
        error : error.message || "Server Error"
    });


};

module.exports = errorHandler;
