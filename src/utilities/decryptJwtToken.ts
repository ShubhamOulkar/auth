import { jwtDecrypt, JWTDecryptResult } from "jose";
import { SessionDecryptOptions } from "../type";
async function decryptJwtToken(
  tokenName: string,
  token: string,
  secreteKey: Uint8Array,
  options: SessionDecryptOptions
): Promise<JWTDecryptResult | false> {
  try {
    const result = await jwtDecrypt(token, secreteKey, options);
    console.log(`${tokenName} is verified`);
    return result;
  } catch (error) {
    console.error(
      `Error verifying ${tokenName}: `,
      error instanceof Error ? error.stack : error
    );
    return false;
  }
}

export default decryptJwtToken;
