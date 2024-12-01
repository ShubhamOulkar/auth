import { jwtDecrypt } from "jose";

async function decryptJwtToken(tokenName, token, secreteKey, options) {
  try {
    const result = await jwtDecrypt(token, secreteKey, options);
    console.log(`${tokenName} is verified`);
    return result;
  } catch (error) {
    return new Error(`Error verifying ${tokenName}: ${error.message}`);
  }
}

export default decryptJwtToken;
