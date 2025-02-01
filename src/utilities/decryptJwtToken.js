import { jwtDecrypt } from "jose";

async function decryptJwtToken(tokenName, token, secreteKey, options) {
  try {
    const result = await jwtDecrypt(token, secreteKey, options);
    console.log(`${tokenName} is verified`);
    return result;
  } catch (error) {
    console.error(`Error verifying ${tokenName}: `, error.stack);
    return false;
  }
}

export default decryptJwtToken;
