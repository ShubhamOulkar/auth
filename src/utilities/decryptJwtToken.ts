import { jwtDecrypt, JWTDecryptResult } from "jose";
type SessionDecryptOptions = {
  issuer: string | undefined;
  audience: string | undefined;
  subject: string | undefined;
};
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
