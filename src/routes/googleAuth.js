import express from "express";
import { OAuth2Client } from "google-auth-library";
import { config } from "dotenv";
config();
import verifySession from "../middleware/verifySession.js";
import { saveUser } from "../db/dbUtils.js";
import getAuthenticationKay from "../utilities/getAuthenticationKey.js";

const googleClient = new OAuth2Client();
const googleAuth = express.Router();

googleAuth.post("/login", verifySession, async (req, res, next) => {
  try {
    const googleId = res.locals.googleId;

    const ticket = await googleClient.verifyIdToken({
      idToken: googleId,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    const googlePayload = ticket.getPayload();

    const user = {
      firstName: googlePayload.given_name,
      lastName: googlePayload.family_name,
      email: googlePayload.email,
      googleSub: googlePayload.sub,
      password: "googleStorage",
      confirmPassword: "false",
      ...googlePayload,
    };

    // save user in database
    await saveUser(user);

    // generate auth token
    const key = getAuthenticationKay(user.email);

    //TODO save key in cache for 1hr

    // set auth key for 1hr
    res.cookie("key", key, {
      maxAge: 3600000,
      secure: true,
      sameSite: "strict",
    });

    // send response to the client
    res.setHeader("Content-Type", "application/json");

    res.status(200).json({
      success: true,
      msg: `User ${user.email} login successfully.`,
      redirect: "/profile",
    });

    console.log(`${user.email} login successful`);
  } catch (err) {
    next(err);
  }
});

export default googleAuth;
