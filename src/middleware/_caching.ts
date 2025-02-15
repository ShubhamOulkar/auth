import { NextFunction, Request, Response } from "express";
import getFileModifiedTime from "../utilities/getFileModifiedTime.js";

function caching(filePath: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileModifiedTime = await getFileModifiedTime(filePath);
      const ifModifiedSince = req.headers["if-modified-since"];

      if (ifModifiedSince === fileModifiedTime) {
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Last-Modified", fileModifiedTime);
        return res.sendStatus(304); //send Not Modified status code
      }

      // Set Last-Modified header if it's a fresh request
      res.setHeader("Last-Modified", fileModifiedTime);
      next();
    } catch (error) {
      console.error("Error in clientHttpValidation middleware:", error);
      next(error); // Pass error to the error handler
    }
  };
}

export default caching;
