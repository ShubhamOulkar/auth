import express from "express";
import verifySession from "../middleware/verifySession.js";
import { findUser, verifyUser } from "../db/dbUtils.js";
import {
  throwError,
  getAuthenticationKey,
} from "../utilities/utilitiesExporter.js";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { updateUserPassword } from "../db/dbUtils.js";
config();

const twoFa = express.Router();
let verificationCode = "ASD00"; //delete

//verify cross site forgery request and session id
twoFa.use(verifySession);

function sendResponseToClient(res, result, msg, redirect = null) {
  const jsonData = result
    ? {
        success: result,
        msg: msg,
        redirect: redirect,
      }
    : {
        success: result,
        err_msg: msg,
        redirect: redirect,
      };
  //TODO encrypt jsonData

  // send response to the client
  res.setHeader("Content-Type", "application/json");

  res.status(200).json(jsonData);

  console.log(msg);
}

async function sendUserResponseToClient(res, email) {
  try {
    // get user data from server
    const data = await findUser(email, "user profile data");

    const key = await getAuthenticationKey(email);

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

    console.log(`✔️ ${email} login successful`);
  } catch (err) {
    throw err;
  }
}

// reset password
twoFa.post("/resetpassword", async (req, res, next) => {
  try {
    // TODO validate form data

    const { email, password } = res.locals.formData;

    if (!email || !password) {
      throwError("Request body invalid", 500);
    }

    // HASH Password
    const passHash = await bcrypt.hash(password, 10);

    // find email user and update password
    const result = await updateUserPassword(email, passHash, true);

    // if update failed then return error response else success response
    if (result) {
      sendResponseToClient(
        res,
        result,
        `Password is reset for ${email}`,
        "/login"
      );
    } else {
      sendResponseToClient(
        res,
        result,
        `Failed to reset password, ${email} try again.`,
        "/login"
      );
    }
  } catch (err) {
    next(err);
  }
});

// verify otp send by client
twoFa.post("/verifyotp", async (req, res, next) => {
  try {
    // TODO VALIDATE FORM DATA
    const { otp, email, twoFaContext } = res.locals.formData;

    if (!otp || !email || !twoFaContext)
      throwError("Request do not contain valid request body.", 500);

    // TODO get otp from cache for given email
    // TODO if otp is not found for email send error
    // if otp are matched send success
    if (otp === verificationCode) {
      twoFaContext === "verify email"
        ? await sendUserResponseToClient(res, email) // user login to profile after email verification
        : sendResponseToClient(
            // user redirect to login on reset password
            res,
            true,
            `${email} otp is verified.`,
            "/newpassword"
          );
    } else {
      sendResponseToClient(
        res,
        false,
        `${email} otp verification failed. Enter valid code.`
      );
    }
  } catch (err) {
    next(err);
  }
});

// verify email is present in DB before resetting new password
twoFa.post("/verifyemail", async (req, res, next) => {
  try {
    //TODO validate form data

    const { email } = res.locals.formData;

    !email && throwError("Request contain invalid email.", 500);

    const result = await verifyUser(email);

    if (result) {
      // TODO generate verification code
      // TODO save in cache memory
      // TODO send verification code to an email

      // send response to the client
      sendResponseToClient(
        res,
        result,
        `Verification code has been send to ${email}.`
      );
    } else {
      sendResponseToClient(
        res,
        result,
        `User ${email} is invalid. Try correct email`
      );
    }
  } catch (err) {
    next(err);
  }
});

export default twoFa;
