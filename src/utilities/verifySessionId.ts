import { jwtDecrypt, base64url } from "jose";
import { config } from "dotenv";
config();
import { throwError, checkKeyValues } from "./utils.js";

const SESSION_SECRET = process.env.SESSION_SECRET || "";
const sessionSecreteKey = base64url.decode(SESSION_SECRET);
const decrytOption = {
  issuer: process.env.JWT_ISSURE,
  audience: process.env.JWT_AUDIENCE,
  subject: process.env.JWT_SUBJECT,
};

async function verifySessionId(sessionId_1: string, sessionId_2: string) {
  try {
    const [
      {
        payload: { payload: payload_1 },
        protectedHeader: header_1,
      },
      {
        payload: { payload: payload_2 },
        protectedHeader: header_2,
      },
    ] = await Promise.all([
      await jwtDecrypt(sessionId_1, sessionSecreteKey, decrytOption),
      await jwtDecrypt(sessionId_2, sessionSecreteKey, decrytOption),
    ]);

    // check payload and throw error on payload mismatch
    await Promise.all([
      checkKeyValues(payload_1, payload_2),
      checkKeyValues(header_1, header_2),
    ]);
    console.log("jwt headers are verified");
    return true;
  } catch (err) {
    // throw error on expiration id, issuer, audience, subject mismatch
    throwError(`Invalid session id error: ${err}`);
  }
}

export default verifySessionId;
