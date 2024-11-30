import ErrorResponse from "../errorObj/errorClass.js";

function errorHandler(err, req, res, next) {
  let error = err;

  console.error(err);

  if (!(error instanceof ErrorResponse)) {
    error = new ErrorResponse(err.message, 500);
  }

  res.status(error.errorCode).json({
    success: false,
    err_msg: error.message,
    err_code: error.errorCode,
    redirect: "/login",
  });
}

export default errorHandler;
