import { createTransport } from "nodemailer";
import generateOtp from "./code.js";
import { config } from "dotenv";
config();
import { saveVerificationCode } from "../db/dbUtils.js";

const fromEmail = {
  name: process.env.JWT_ISSURE,
  address: process.env.EMAIL_ISSURE_ADDRESS,
};

const transporter = createTransport({
  service: "Gmail",
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports 25,589,2525
  auth: {
    user: process.env.EMAIL_ISSURE_ADDRESS, // issure email address
    pass: process.env.GMAIL_APP_PASSWORD, // google app password
  },
});

async function sendActivity(recepientEmail, msg) {
  try {
    if (!recepientEmail) {
      throw new Error(
        "do not call sendActivity function without recepientEmail parameter"
      );
    }

    const mailOptions = {
      from: fromEmail,
      to: recepientEmail,
      subject: "⚡ Auth-SSR critical activity detected",
      html: `${recepientEmail} ${msg}`,
    };

    // without callback following function returns promise object
    const result = await transporter.sendMail(mailOptions);

    if (!result.messageId) {
      throw new Error("Error in sending email");
    }

    console.log(`Activity Email sent to ${recepientEmail}: `, result.response);
  } catch (err) {
    console.error(
      `Error in sending activity email to ${recepientEmail}: `,
      err
    );
    throw err;
  }
}

export default sendActivity;
