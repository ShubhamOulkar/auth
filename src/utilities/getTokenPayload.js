import { randomBytes } from "crypto";
// generate 32 random bytes and return payload object
function getTokenPayload() {
  return new Promise((resolve, reject) => {
    randomBytes(32, (err, buff) => {
      if (err) reject(err);
      const id = buff.toString("hex");
      const payload = {
        id,
        iat: Math.floor(Date.now() / 1000),
      };
      resolve(payload);
    });
  });
}

export default getTokenPayload;
