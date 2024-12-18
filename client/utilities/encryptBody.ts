import { EncryptJWT, base64url } from "jose";
import { ClientCredential } from "../types/clientCredentialType";
import { CLientErrorType } from "../types/notificationType";
import {
  postBodySecretKey,
  postBodyEncSubject,
  postBodyEncExpTime,
  postBodyEncAudience,
  postBodyEncIssure,
} from "../env";

const secretKey = base64url.decode(postBodySecretKey);

// Function to generate a CSRF token
async function encryptBody(
  payload: ClientCredential
): Promise<string | CLientErrorType> {
  try {
    // create encrypted body
    const bodyEnc = await new EncryptJWT({ payload })
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256", typ: "jwt" })
      .setIssuedAt()
      .setSubject(postBodyEncSubject)
      .setExpirationTime(postBodyEncExpTime)
      .setIssuer(postBodyEncIssure)
      .setAudience(postBodyEncAudience)
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
