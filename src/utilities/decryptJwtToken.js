import { jwtDecrypt } from "jose";
import { throwError } from "./utils.js";

async function decryptJwtToken(tokenName, token, secreteKey, options) {
  try {
    const result = await jwtDecrypt(token, secreteKey, options);
    console.log(`${tokenName} is verified`);
    return result;
  } catch (error) {
    throwError(`Error verifying ${tokenName}: ${error.message}`, 401);
  }
}

export default decryptJwtToken;
