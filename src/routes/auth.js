import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import { saveUser, findUser } from "../db/dbUtils.js";
import verifySession from "../middleware/verifySession.js";
import { throwError } from "../utilities/utils.js";
import getAuthenticationKay from "../utilities/getAuthenticationKey.js";
import { setSessionAndCsrf } from "../middleware/setSessionAndCsrfToken.js";
import decryptJwtToken from "../utilities/decryptJwtToken.js";
import { deleteCsrfToken, deleteUser } from "../db/dbUtils.js";
import { base64url } from "jose";
import { config } from "dotenv";
config();

const SECRET = process.env.AUTH_SECRET_KEY;
const secreteKey = base64url.decode(SECRET);
const csrfColl = process.env.CSRF_COLLECTION;

const decryptOptions = {
  issuer: process.env.JWT_ISSURE,
  audience: process.env.JWT_AUDIENCE,
  subject: process.env.JWT_SUBJECT,
};

//verify cross site forgery request and session id
router.use(verifySession);

// user logout
router.post("/logout", async (req, res, next) => {
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

    // TODO csrf and session cookie from cache
    await deleteCsrfToken(csrfColl, res.locals.csrfToken);

    // delete user if delete btn is pressed by user(logout and delete user uses same endpoint)
    // TODO seperate this endpoint in future updates
    if (res.locals.btnName) await deleteUser(user.email);

    // TODO set new session and csrf cookie
    await setSessionAndCsrf(req, res);

    // TODO remove auth key
    res.cookie(process.env.VITE_AUTH_KEY, "", {
      maxAge: 0,
      secure: true,
      sameSite: "strict",
    });

    // TODO send response to client (client delete local storage on success response and redirect to login page)
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
router.post("/login", async (req, res, next) => {
  try {
    //TODO validate form data

    const { email, password } = res.locals.formData;

    !email || (!password && throwError("Requested body is invalid", 500));

    const data = await findUser(email);

    console.log("data:", data);

    // check password
    const passMatch = await bcrypt.compare(password, data.password);

    !passMatch && throwError("Authentication failed, password is wrong.");

    const key = await getAuthenticationKay(data.email);

    //TODO save key in cache for 1hr

    // set auth key for 1hr
    res.cookie(process.env.VITE_AUTH_KEY, key, {
      maxAge: 3600000,
      secure: true,
      sameSite: "strict",
    });

    const sendUser = {
      first: data.firstName,
      last: data.lastName,
      email: data.email,
      picture: data?.picture,
    };

    // send response to the client
    res.setHeader("Content-Type", "application/json");

    res.status(200).json({
      success: true,
      msg: `User ${data.email} login successfully.`,
      redirect: "/profile",
      user: sendUser,
    });

    console.log(`${email} login successful`);
  } catch (err) {
    next(err);
  }
});

// user registration
router.post("/register", async (req, res, next) => {
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

export default router;
