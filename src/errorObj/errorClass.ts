export default class ErrorResponse {
  message: string;
  errorCode: number;
  constructor(message: string, errorCode: number) {
    if (typeof message !== "string") {
      throw new Error("Error message must be a string");
    }

    if (typeof errorCode !== "number") {
      throw new Error("Error code must be a number");
    }
    this.message = message;
    this.errorCode = errorCode;
  }
}
