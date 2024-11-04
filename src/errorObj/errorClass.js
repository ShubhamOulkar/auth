class ErrorResponse {
  constructor(message, errorCode) {
    this.message = message;
    this.errorCode = errorCode;
  }
}

module.exports = ErrorResponse;
