import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

import { saveUser, findUser } from "../db/dbUtils";
import verifyToken from "../middleware/verifySession";
import { ErrorResponse } from "../errorObj/errorClass";

// protected route
// TODOs Implement OAuth scheme
// TODO 1. send www-Authonticate header in the case of unauthorized or forbidden resource access
// TODO 2. send correct Authorization header from the client request
/*
example client request 
POST /request_temp_credentials HTTP/1.1
     Host: server.example.com
     Authorization: OAuth realm="Example",
        oauth_consumer_key="0685bd9184jfhq22",
        oauth_token="ad180jjd733klru7",
        oauth_signature_method="HMAC-SHA1",
        oauth_signature="wOJIO9A2W5mFwDgiDvZbTSMK%2FPY%3D",
        oauth_timestamp="137131200",
        oauth_nonce="4572616e48616d6d65724c61686176",
        oauth_version="1.0"

 */
// TODO 3. send proper response on credentials validation, "application/x-www-form-urlencoded" content type with a 200 status code (OK).
/*
example server response 
HTTP/1.1 200 OK
     Content-Type: application/x-www-form-urlencoded

     oauth_token=hdk48Djdsa&oauth_token_secret=xyz4992k83j47x0b&
     oauth_callback_confirmed=true
 */
router.get("/protected", verifyToken, (req, res) => {
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
      throw new ErrorResponse("Requested body is invalid", 400); //bad request
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
      throw new ErrorResponse("Requested body is invalid", 400); //bad request
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

export { router };
