import jwt from "jsonwebtoken";
import ErrorResponse from "../errorObj/errorClass.js";

/**
 * This function is not used in production code.This function is used in development for design testing purpose.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

function authoriseUser(req, res, next) {
  const token = req.header("Authorization");

  // if (!req.headers["cookie"]) throw new ErrorResponse("Access Forbidden", 403);
  // const token = req.headers["cookie"].slice(6);
  // console.log(req.headers["cookie"].slice(6));

  if (!token) throw new ErrorResponse("Access Denied", 401);

  try {
    const decode = jwt.verify(token, "my-secret-key");
    req.user = decode.user;
    next();
  } catch (err) {
    throw new ErrorResponse("Invalid token", 401);
  }
}

export default authoriseUser;
