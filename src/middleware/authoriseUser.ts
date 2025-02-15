import jwt from "jsonwebtoken";
import ErrorResponse from "../errorObj/errorClass.js";
import { NextFunction, Request, Response } from "express";

function authoriseUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.header("Authorization");

  if (!token) throw new ErrorResponse("Access Denied", 401);

  try {
    const decode = jwt.verify(token, "my-secret-key");
    //@ts-expect-error user is not authorized
    req.user = decode.user;
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new ErrorResponse("Invalid token", 401);
  }
}

export default authoriseUser;
