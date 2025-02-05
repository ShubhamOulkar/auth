import jwt from "jsonwebtoken";
import ErrorResponse from "../errorObj/errorClass.js";

function authoriseUser(
  req: { header: (arg0: string) => any; user: any },
  _res: any,
  next: () => void
) {
  const token = req.header("Authorization");

  // if (!req.headers["cookie"]) throw new ErrorResponse("Access Forbidden", 403);
  // const token = req.headers["cookie"].slice(6);
  // console.log(req.headers["cookie"].slice(6));

  if (!token) throw new ErrorResponse("Access Denied", 401);

  try {
    const decode = jwt.verify(token, "my-secret-key");
    //@ts-ignore
    req.user = decode.user;
    next();
  } catch (err) {
    throw new ErrorResponse("Invalid token", 401);
  }
}

export default authoriseUser;
