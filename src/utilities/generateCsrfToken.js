import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "dotenv";
config();
import getTokenPayload from "./getTokenPayload.js";

const SECRET = process.env.CSRF_SECRET;

// Function to generate a CSRF token
async function generateCsrfToken(sessionId) {
  try {
    let payload = await getTokenPayload();
    // add session to csrf token
    payload = { ...payload, sessionId };
    // sign csrf
    const jwtCsrf = jwt.sign(payload, SECRET);
    // hash csrf
    const csrfHash = crypto
      .createHash("sha512")
      .update(jwtCsrf)
      .digest("base64url");

    return { csrfHash, jwtCsrf };
  } catch (err) {
    console.error(err);
  }
}

export default generateCsrfToken;
