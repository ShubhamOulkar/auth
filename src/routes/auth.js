import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { saveUser, findUser } from "../db/dbUtils.js";
import ErrorResponse from "../errorObj/errorClass.js";
import verifyToken from "../middleware/verifySession.js";

router.use(verifyToken);
// protected route
router.get("/protected", (req, res) => {
  res
    .status(302)
    .json({ message: `protected route is accessed by user ${req.user}` });
});

// user registration
router.post("/register", async (req, res, next) => {
  try {
    const {
      data: { name: username, password },
    } = req.body;

    if (!username || !password) {
      console.error("invalid request body");
      throw new ErrorResponse("Requested body is invalid", 500);
    }

    const hashPass = await bcrypt.hash(password, 10);
    await saveUser(username, hashPass);
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ message: "user registred successfully." });
  } catch (err) {
    next(err);
  }
});

// user login
router.post("/login", async (req, res, next) => {
  try {
    const {
      data: { name: username, password },
    } = req.body;

    if (!username || !password) {
      console.error("invalid request body");
      throw new ErrorResponse("Requested body is invalid", 500);
    }

    const data = await findUser(username);

    // check password match
    const passMatch = await bcrypt.compare(password, data.pass);

    if (!passMatch) {
      console.error(`but ${username} entered wrong password.`);
      throw new ErrorResponse("Authentication failed, password is wrong.", 401);
    }

    const token = jwt.sign({ user: data.user }, "my-secret-key", {
      expiresIn: "1h",
    });

    res.setHeader("Content-Type", "application/json");
    //! set token as cookie, add Secure attribute in https
    // res.setHeader(
    //   "Set-Cookie",
    //   `token=${token}; Domain=localhost;  Max-Age=3600; HttpOnly; Path=/`
    // );

    res.send({ token: token });

    console.log(`${username} login`);
  } catch (err) {
    next(err);
  }
});

export default router;
