// const mongoose = require("mongoose");
// const { ApiError } = require("../utils/ApiError.js");

// const errorHandler = (err, req, res, next) => {
//   let error = err;

//   // Check if the error is not an instance of ApiError
//   if (!(error instanceof ApiError)) {
//     // Determine an appropriate status code
//     const statusCode =
//       error.statusCode || (error instanceof mongoose.Error ? 400 : 500);

//     // Set a message from the native Error instance or a custom one
//     const message = error.message || "Something went wrong";

//     // Create a new ApiError instance for consistency
//     error = new ApiError(statusCode, message, error.errors || [], error.stack);
//   }

//   // Construct the response object
//   const response = {
//     statusCode: error.statusCode,
//     message: error.message,
//     errors: error.errors,
//     success: error.success,
//     ...(process.env.NODE_ENV === "development" && { stack: error.stack }), // Include stack trace in development mode
//   };

//   // Send error response
//   return res.status(error.statusCode).json(response);
// };

// module.exports = { errorHandler };

const mongoose = require("mongoose");
const { ApiError } = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Check if the error is an instance of ApiError
  if (!(error instanceof ApiError)) {
    // Determine an appropriate status code
    const statusCode =
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);

    // Set a message from the native Error instance or a custom one
    const message = error.message || "Something went wrong";

    // Create a new ApiError instance for consistency
    error = new ApiError(
      statusCode,
      message,
      error.errors || [],
      error.stack || ""
    );
  }

  // Construct the response object
  const response = {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    success: false,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }), // Include stack trace in development mode
  };

  // Send error response
  return res.status(error.statusCode).json(response);
};

module.exports = { errorHandler };
