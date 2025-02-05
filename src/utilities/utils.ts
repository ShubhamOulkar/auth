import ErrorResponse from "../errorObj/errorClass.js";

function throwError(message: string, errorCode = 401) {
  throw new ErrorResponse(message, errorCode);
}

// function checkKeyValues(object1, object2) {
//   Object.keys(object1).forEach((key) => {
//     object1[key] !== object2[key] && throwError(`Invalid key error: ${key}`);
//   });
// }

function checkKeyValues(
  object1: { [x: string]: any },
  object2: { [x: string]: any }
) {
  return new Promise((resolve, reject) => {
    // Check if inputs are objects
    if (typeof object1 !== "object" || typeof object2 !== "object") {
      reject(new Error("Both inputs must be objects"));
      return;
    }

    Object.keys(object1).forEach((key) => {
      object1[key] !== object2[key] &&
        reject(throwError(`Invalid key error: ${key}`));
    });

    resolve(true);
  });
}

export { throwError, checkKeyValues };
