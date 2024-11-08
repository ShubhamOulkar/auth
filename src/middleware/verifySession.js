const jwt = require("jsonwebtoken");
const ErrorResponse = require("../errorObj/errorClass");

function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  // if (!req.headers["cookie"]) throw new ErrorResponse("Access Forbidden", 403);
  // const token = req.headers["cookie"].slice(6);
  // console.log(req.headers["cookie"].slice(6));

  if (!token) throw new ErrorResponse("Access Denied", 401);

  try {
    const decode = jwt.verify(token, "my-secret-key");
    req.user = decode.user;
    next();
  } catch (err) {
    throw new ErrorResponse("Invalid token", 401);
  }
}

module.exports = verifyToken;
