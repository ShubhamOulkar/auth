import express, { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { config } from "dotenv";
config();
import verifySession from "../middleware/verifySession.js";
import { saveUser, verifyUser } from "../db/dbUtils.js";
import getAuthenticationKay from "../utilities/getAuthenticationKey.js";
import { limiter } from "../middleware/rateLimiter.js";

const authKeyName = process.env.VITE_AUTH_KEY;

const googleClient = new OAuth2Client();
const googleAuth: Router = express.Router();

//verify cross site forgery request and session id
googleAuth.use(verifySession);

// Apply the rate limiting middleware to gooleAuth requests.
googleAuth.use(limiter);

function sendResponse(res: any, user: any, authKey: string) {
  //TODO save key in cache for 1hr

  const clientUser = {
    first: user.firstName,
    last: user.lastName,
    email: user.email,
    picture: user.picture,
  };

  // set auth key for 1hr
  res.cookie(authKeyName, authKey, {
    maxAge: 3600000,
    secure: true,
    sameSite: "strict",
  });

  // send response to the client
  res.setHeader("Content-Type", "application/json");

  res.status(200).json({
    success: true,
    msg: `⚡ User ${user.email} login successful.`,
    redirect: "/profile",
    user: clientUser,
  });

  console.log(`${user.email} login successful`);
}

googleAuth.post("/login", async (_req, res, next) => {
  try {
    const googleId = res.locals.googleId;

    // verify google id
    const ticket = await googleClient.verifyIdToken({
      idToken: googleId,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    // get user data
    const googlePayload = ticket.getPayload();

    const user = {
      googleVerified: true,
      firstName: googlePayload?.given_name,
      lastName: googlePayload?.family_name,
      email: googlePayload?.email,
      googleSub: googlePayload?.sub,
      password: "googleStorage",
      confirmPassword: "false",
      ...googlePayload,
    };

    // check user is already in store as google verified user
    let isGoogleVerify = await verifyUser(user.email || "");

    // generate auth token
    const authKey = await getAuthenticationKay(user.email || "");

    if (!isGoogleVerify) {
      // if not verified save user in database
      //@ts-ignore
      await saveUser(user);
    }
    // verified then send response
    sendResponse(res, user, authKey || "");
  } catch (err) {
    next(err);
  }
});

export default googleAuth;
