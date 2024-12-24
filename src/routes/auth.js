import express from "express";
import bcrypt from "bcrypt";
import verifySession from "../middleware/verifySession.js";
import { setSessionAndCsrf } from "../middleware/setSessionAndCsrfToken.js";
import {
  saveUser,
  findUser,
  deleteCsrfToken,
  deleteUser,
} from "../db/dbUtils.js";
import { throwError, decryptJwtToken } from "../utilities/utilitiesExporter.js";
import { base64url } from "jose";
import { config } from "dotenv";
import { limiter } from "../middleware/rateLimiter.js";
config();

const auth = express.Router();
const SECRET = process.env.AUTH_SECRET_KEY;
const secreteKey = base64url.decode(SECRET);
const csrfColl = process.env.CSRF_COLLECTION;

const decryptOptions = {
  issuer: process.env.JWT_ISSURE,
  audience: process.env.JWT_AUDIENCE,
  subject: process.env.JWT_SUBJECT,
};

//verify cross site forgery request and session id
auth.use(verifySession);

// Apply the rate limiting middleware to auth requests.
auth.use(limiter);

// user logout
auth.post("/logout", async (req, res, next) => {
  try {
    // TODO decrypt auth token
    const authKey = res.locals.authKey;

    const authResult = await decryptJwtToken(
      "auth key varification ",
      authKey,
      secreteKey,
      decryptOptions
    );

    if (authResult instanceof Error) {
      // log error on server
      throwError(
        `❌ Client sending Threat to the server: auth key is not matched. : ${authResult}`,
        402
      );
    }

    // TODO validate data from client ()
    const user = res.locals.userData;

    // TODO delete auth key from cache

    //  csrf and session cookie from cache
    await deleteCsrfToken(csrfColl, res.locals.csrfToken);

    // delete user if delete btn is pressed by user(logout and delete user uses same endpoint)
    // TODO seperate this endpoint in future updates
    if (res.locals.btnName) await deleteUser(user.email);

    // T set new session and csrf cookie
    await setSessionAndCsrf(req, res);

    //  remove auth key
    res.cookie(process.env.VITE_AUTH_KEY, "", {
      maxAge: 0,
      secure: true,
      sameSite: "strict",
    });

    //  send response to client (client delete local storage on success response and redirect to login page)
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      success: true,
      msg: `User ${user.email} logout successfully.`,
      redirect: "/login",
    });

    console.log(`${user.email} ${res.locals.btnName} successfull.`);
  } catch (err) {
    next(err);
  }
});

// user login
auth.post("/login", async (req, res, next) => {
  try {
    //TODO validate form data

    const { email, password } = res.locals.formData;

    !email && throwError("Email in requested body is invalid", 500);

    const data = await findUser(email);

    // allowing to login for google verified user
    // check password if not google verifided user
    if (!data.googleVerified) {
      // check password
      const passMatch = await bcrypt.compare(password, data.password);

      !passMatch && throwError("Authentication failed, password is wrong.");
    }

    //
    // send 2FA : verify email address response to the client
    res.setHeader("Content-Type", "application/json");

    res.status(200).json({
      success: true,
      msg: `${
        data.googleVerified ? "Last time you login using google." : ""
      } Please verify ${data.email}.`,
      redirect: "/verifyemail",
    });

    console.log(`⚡ User ${data.email} verifying email.`);
  } catch (err) {
    next(err);
  }
});

// user registration
auth.post("/register", async (req, res, next) => {
  try {
    const formData = res.locals.formData;

    //throw error on invalid form data
    !formData.username ||
      (!formData.password && throwError("Requested body is invalid", 500));

    // validate form data

    //hash password
    formData.password = await bcrypt.hash(formData.password, 10);
    // add default field email_verified is false
    formData.email_verified = false;

    // add googleSub none
    formData.googleSub = `${formData.email} is not verified by google`;

    // save user into database
    const result = await saveUser(formData);

    // send response to the client
    res.setHeader("Content-Type", "application/json");
    result &&
      res.status(201).json({
        success: true,
        msg: `User ${formData.email} registred successfully. Please login using email.`,
        redirect: "/login",
      });

    console.log(`${formData.email} registerd successfully.`);
  } catch (err) {
    next(err);
  }
});

export default auth;
