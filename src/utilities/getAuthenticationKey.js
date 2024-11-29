import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const secretKey = process.env.AUTH_SECRET_KEY;

function getAuthenticationKay(email) {
  const key = jwt.sign({ user: email }, secretKey, {
    expiresIn: "1h",
  });

  return key;
}

export default getAuthenticationKay;
