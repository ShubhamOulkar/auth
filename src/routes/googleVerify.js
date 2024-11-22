import express from "express";
import jwt from "jsonwebtoken";
import { jwtDecrypt, base64url } from "jose";
import { OAuth2Client } from "google-auth-library";
import { config } from "dotenv";
config();
import getCookies from "../utilities/getCookies.js";
import { findCsrfHash } from "../db/dbUtils.js";
import ErrorResponse from "../errorObj/errorClass.js";

const csrfColl = process.env.CSRF_COLLECTION;
const CSRF_SECRET = process.env.CSRF_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const sessionSecreteKey = base64url.decode(SESSION_SECRET);

const googleClient = new OAuth2Client();
const googleAuth = express.Router();

googleAuth.post("/login", async (req, res, next) => {
  try {
    await verify(req);
    res.status(201).send("OK");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

function throwError(message) {
  throw new ErrorResponse(message, 500);
}

function checkKeyValues(object1, object2) {
  Object.keys(object1).forEach((key) => {
    object1[key] !== object2[key] &&
      throwError(`Invalid session id error at : ${key}`);
  });
}

export async function verifySessionId(sessionId_1, sessionId_2) {
  try {
    const [
      {
        payload: { payload: payload_1 },
        protectedHeader: header_1,
      },
      {
        payload: { payload: payload_2 },
        protectedHeader: header_2,
      },
    ] = await Promise.all([
      await jwtDecrypt(sessionId_1, sessionSecreteKey, {
        issuer: process.env.JWT_ISSURE,
        audience: process.env.JWT_AUDIENCE,
        subject: process.env.JWT_SUBJECT,
      }),
      await jwtDecrypt(sessionId_2, sessionSecreteKey, {
        issuer: process.env.JWT_ISSURE,
        audience: process.env.JWT_AUDIENCE,
        subject: process.env.JWT_SUBJECT,
      }),
    ]);

    // check payload and throw error on payload mismatch
    checkKeyValues(payload_1, payload_2);

    // check headers and throw error on herders mismatch
    checkKeyValues(header_1, header_2);

    return true;
  } catch (err) {
    // throw error on expiration id, issuer, audience, subject mismatch
    throwError(`Invalid session id error : ${err.name}`);
  }
}

async function verify(req, res) {
  try {
    /*
     * validate csrf token and session id
     * 1. get csrf token from request body, request header cookie, cache database(not implemented) and check all are same strings.(double-submit-cookie)
     * 2. get request session cookie and check session cookie is valid for csrf token from request body.
     * Note: csrf token is hash base64 string, this hash is store in cache with corresponding session Id.
     * 3. csrf token is hash of the signed jwt token, so jwt verification is implemented.
     * 4. session id verification. Session id is encrypted. So that decrypt then header, payload, audience, issure, expiration, subject are validated.
     */
    // get token and id from request header
    let { cookieCsrf, cookieSession } = getCookies(req.headers.cookie);
    // get token and id from body
    let { googleId, csrfToken: bodyCsrf } = req.body;

    // check csrf token from header and body is same
    cookieCsrf !== bodyCsrf && throwError("Invalid csrf token");
    // check csrf token is awailable in cache memory, this function throws error if not find
    let { _id: cacheCsrfHash, jwt: cacheCsrfJwt } = await findCsrfHash(
      csrfColl,
      bodyCsrf
    );

    // verify  session id in jwtCsrf payload
    jwt.verify(cacheCsrfJwt, CSRF_SECRET, (err, csrfPayload) => {
      // cached jwt invalid error
      err && throwError(err.name);

      //check session id is present in csrf payload
      csrfPayload.sessionId !== cookieSession &&
        throwError("Invalid session id");

      // verify session id
      verifySessionId(cookieSession, csrfPayload.sessionId)
        .then((res) => console.log("Session id verified successfully : ", res))
        .catch((err) => {
          console.error(err);
        });
    });

    console.log("after verification");
    /*
     * on passed validation verify user from google
     * if email does not contain @gmail.com and email_verified false then implement another methods to verify user.
     * The exp field shows the expiration time for you to verify the token on your server side. It is one hour for the ID token obtained from Sign In With Google. You need to verify the token before the expiration time. Don't use exp for session management. An expired ID token does not mean the user is signed out. Your app is responsible for session management of your users.
     */
    const ticket = await googleClient.verifyIdToken({
      idToken: googleId,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log("The unique ID of the user's Google Account:", payload); // unique user identifier from google
  } catch (err) {
    throw new Error(err.message);
  }
}

export default googleAuth;
