import { EncryptJWT, base64url } from "jose";
import { config } from "dotenv";
config();

const SECRET = process.env.AUTH_SECRET_KEY || "";
const secreteKey = base64url.decode(SECRET);

async function getAuthenticationKey(email: string) {
  try {
    const authKey = await new EncryptJWT({ email })
      .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256", typ: "jwt" })
      .setIssuedAt()
      .setSubject(process.env.JWT_SUBJECT || "")
      .setExpirationTime(process.env.VITE_AUTH_EXP_TIME || "")
      .setIssuer(process.env.JWT_ISSURE || "")
      .setAudience(process.env.JWT_AUDIENCE || "")
      .encrypt(secreteKey);

    return authKey;
  } catch (err) {
    console.error(err);
  }
}

export default getAuthenticationKey;
