import { SignJWT, EncryptJWT, base64url, jwtDecrypt } from "jose";
import { config } from "dotenv";
config();
import getTokenPayload from "./getTokenPayload.js";

const SECRET = process.env.SESSION_SECRET;
const secreteKey = base64url.decode(SECRET);
// Function to generate a CSRF token
async function generateSessionId() {
  try {
    const payload = await getTokenPayload();
    // create session id
    // const sessionId = await new SignJWT(payload)
    //   .setProtectedHeader({
    //     alg: "HS256",
    //     typ: "jwt",
    //   })
    //   .setIssuedAt()
    //   .setAudience(process.env.JWT_AUDIENCE)
    //   .setIssuer(process.env.JWT_ISSURE)
    //   .setExpirationTime(process.env.JWT_EXP_TIME)
    //   .setSubject(process.env.JWT_SUBJECT)
    //   .sign(secreteKey);

    // create encrypt session id
    const sessionId = await new EncryptJWT({ payload })
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256", typ: "jwt" })
      .setIssuedAt()
      .setSubject(process.env.JWT_SUBJECT)
      .setExpirationTime(process.env.JWT_EXP_TIME)
      .setIssuer(process.env.JWT_ISSURE)
      .setAudience(process.env.JWT_AUDIENCE)
      .encrypt(secreteKey);

    return sessionId;
  } catch (err) {
    console.error(err);
  }
}

export default generateSessionId;
