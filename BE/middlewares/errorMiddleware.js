const ErrorHandler = require("../utils/errorHandler");

// It is used to handle error and can be used with erroHandler class in utils
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode ? err.statusCode : 500;
  err.message = err.message ? err.message : "Internal sever error";

  // Wrong mongodb error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400); 
  }

  res.status(statusCode).json({
    success: false,
    msg: err.message,
    statusCode: err.statusCode,
  });
  // console.log("statusCode: ", err.stack);
};

module.exports = { errorMiddleware };
