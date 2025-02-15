import { ErrorHandler } from "../type.js";
import { throwError } from "../utilities/utils.js";

const isProduction = process.env.NODE_ENV === "production";

export const handleError = (error: ErrorHandler) => {
  if (isProduction) {
    // Generic error in production
    throwError(error.message, 500);
  } else {
    // Detailed error in development
    throwError(error.stack, 500);
  }
};
