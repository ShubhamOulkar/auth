import { stat } from "fs/promises";
import ErrorResponse from "../errorObj/errorClass.js";

async function getFileModifiedTime(path: string) {
  // get file modified date from the system stats.
  // use this to create last-Modified Header and sending 304 code on date match
  try {
    const stats = await stat(path);
    const fileModifiedTime = new Date(stats.mtime).toUTCString();
    return fileModifiedTime;
  } catch (err) {
    console.log("Error while reading client files stats:", err);
    throw new ErrorResponse("Error while reading client files stats", 500);
  }
}

export default getFileModifiedTime;
