import ErrorResponse from "../errorObj/errorClass.js";

function errorHandler(err, req, res, next) {
  let error = err;

  console.error("server errors:", err);

  if (!(error instanceof ErrorResponse)) {
    // send error html code on server errors (server handle errors)
    error = new ErrorResponse(err.message, 500);

    const errHtml = `<h4>Internal server Error: ${error.errorCode} :: ${error.message}
    </h4>`;

    res.status(error.errorCode).send(errHtml);
    return;
  }

  // send error json to the client (client handle errors)
  res.status(error.errorCode).json({
    success: false,
    err_msg: error.message,
    err_code: error.errorCode,
    redirect: "/login",
  });
}

export default errorHandler;
