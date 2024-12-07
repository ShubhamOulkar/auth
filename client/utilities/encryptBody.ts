import { EncryptJWT, base64url } from "jose";
import { ClientCredential } from "../types/clientCredentialType";
import { CLientErrorType } from "../types/notificationType";

const SECRET: string = import.meta.env.VITE_POST_BODY_SECRET;
const secretKey = base64url.decode(SECRET);

// Function to generate a CSRF token
async function encryptBody(
  payload: ClientCredential
): Promise<string | CLientErrorType> {
  try {
    // create encrypted body
    const bodyEnc = await new EncryptJWT({ payload })
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256", typ: "jwt" })
      .setIssuedAt()
      .setSubject(import.meta.env.VITE_SUBJECT)
      .setExpirationTime(import.meta.env.VITE_EXP_TIME)
      .setIssuer(import.meta.env.VITE_ISSURE)
      .setAudience(import.meta.env.VITE_AUDIENCE)
      .encrypt(secretKey);

    return bodyEnc;
  } catch (err) {
    console.error(err);

    return {
      success: false,
      err_msg: `Error in encrypting request payload ${err}`,
    } as CLientErrorType;
  }
}

export default encryptBody;
