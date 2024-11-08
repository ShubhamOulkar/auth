const ErrorResponse = require("../errorObj/errorClass");

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ErrorResponse)) {
    error = new ErrorResponse(err.message, 500);
  }

  res.status(error.errorCode).json({
    success: false,
    err_msg: error.message,
    err_code: error.errorCode,
  });
}

module.exports = errorHandler;
