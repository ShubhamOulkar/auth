import express, { NextFunction, Request, Response, Router } from "express";
import verifySession from "../middleware/verifySession.js";
import { findUser, verifyUser, getVerificationCode } from "../db/dbUtils.js";
import {
  throwError,
  getAuthenticationKey,
} from "../utilities/utilitiesExporter.js";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { updateUserPassword } from "../db/dbUtils.js";
import sendEmail from "../mailer/sendEmail.js";
import {
  limiter2Fa,
  otpLimiter,
  newPasslimiter,
} from "../middleware/rateLimiter.js";
import sendActivity from "../mailer/sendActivity.js";
config();

const twoFa: Router = express.Router();

//verify cross site forgery request and session id
twoFa.use(verifySession);

// reset password response
function sendResponseToClient(
  res: Response,
  result: boolean,
  msg: string,
  redirect = ""
) {
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

// login user response
async function sendUserResponseToClient(res: Response, email: string) {
  // get user data from server
  const data = await findUser(email, "user profile data");

  if (data === null) {
    // send response to the client
    res.setHeader("Content-Type", "application/json");

    res.status(200).json({
      success: false,
      msg: `User ${email} data not found in our system.`,
      redirect: "/login",
    });
  }

  const key = await getAuthenticationKey(email);

  //TODO save key in cache for 1hr

  // set auth key for 1hr
  res.cookie(process.env.VITE_AUTH_KEY ?? "a-k", key, {
    maxAge: 3600000,
    secure: true,
    sameSite: "strict",
  });

  const sendUser = {
    first: data?.firstName,
    last: data?.lastName,
    email: data?.email,
    picture: data?.picture,
  };

  // send response to the client
  res.setHeader("Content-Type", "application/json");

  res.status(200).json({
    success: true,
    msg: `User ${data?.email} login successfully.`,
    redirect: "/profile",
    user: sendUser,
  });

  console.log(`✔️ ${email} login successful`);
}

// reset password
twoFa.post("/resetpassword", newPasslimiter, async (_req, res, next) => {
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
      //send email to user about new password activity
      await sendActivity(email, "has set new password.");
    } else {
      sendResponseToClient(
        res,
        result,
        `Failed to reset password, ${email} try again.`,
        "/login"
      );
      // send email to user about new password activity
      await sendActivity(email, "failed to set new password");
    }
  } catch (err) {
    next(err);
  }
});

// verify otp send by client
twoFa.post(
  "/verifyotp",
  limiter2Fa,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO VALIDATE FORM DATA
      const { otp, email, next } = res.locals.formData;

      if (!otp || !email || !next)
        throwError("Request do not contain valid request body.", 500);

      // Get OTP from cache
      const cachedOtp = await getVerificationCode(email);

      // send invalid response
      if (cachedOtp !== otp) {
        sendResponseToClient(res, false, `Invalid OTP for ${email}`);
        return;
      }

      // Handle verification
      if (next === "reset password") {
        // send response on  otp valid f while forgot password
        sendResponseToClient(
          res,
          true,
          `${email} OTP is verified.`,
          "/forgotpassword/newpassword"
        );
      }

      if (next === "user login") {
        //send response if otp valid while user login
        await sendUserResponseToClient(res, email);
      }
    } catch (err) {
      next(err);
    }
  }
);

// verify email is present in DB before resetting new password or login
twoFa.post(
  "/verifyemail",
  otpLimiter,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      //TODO validate form data

      const { email } = res.locals.formData;

      if (!email) throwError("Request contain invalid email.", 500);

      const result = await verifyUser(email);

      switch (result) {
        case true: {
          // send verification on email
          const gmailResult = await sendEmail(email);

          // send response to the client
          if (gmailResult)
            sendResponseToClient(
              res,
              gmailResult,
              `Verification code has been send to ${email}.`
            );
          break;
        }
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
  }
);

export default twoFa;
