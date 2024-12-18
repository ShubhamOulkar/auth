import express from "express";
import verifySession from "../middleware/verifySession.js";
import {
  findUser,
  verifyUser,
  getVerificationCode,
  deleteVerificationCode,
} from "../db/dbUtils.js";
import {
  throwError,
  getAuthenticationKey,
} from "../utilities/utilitiesExporter.js";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { updateUserPassword } from "../db/dbUtils.js";
import sendEmail from "../mailer/sendEmail.js";
import { limiter } from "../middleware/rateLimiter.js";
config();

const twoFa = express.Router();

//verify cross site forgery request and session id
twoFa.use(verifySession);

// Apply the rate limiting middleware to 2fa requests.
twoFa.use(limiter);

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

    // Get OTP from cache
    const cachedOtp = await getVerificationCode(email);

    // Compare OTP
    if (cachedOtp !== otp) {
      sendResponseToClient(res, false, `Invalid OTP for ${email}`);
      return;
    }

    // Handle 2FA verification
    if (twoFaContext === "verify email") {
      await sendUserResponseToClient(res, email);
    } else {
      sendResponseToClient(
        res,
        true,
        `${email} OTP is verified.`,
        "/newpassword"
      );
    }

    // Delete OTP from cache
    await deleteVerificationCode(email);
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

    switch (result) {
      case true:
        // send verification on email
        const result = await sendEmail(email);

        // send response to the client
        result &&
          sendResponseToClient(
            res,
            result,
            `Verification code has been send to ${email}.`
          );
        break;
      case false:
        sendResponseToClient(
          res,
          result,
          `User ${email} is invalid. Try correct email`
        );
        break;
      case "google verified":
        sendResponseToClient(
          res,
          false,
          `User ${email} is google verified. Use login with google button.`
        );
        break;
    }
  } catch (err) {
    next(err);
  }
});

export default twoFa;
