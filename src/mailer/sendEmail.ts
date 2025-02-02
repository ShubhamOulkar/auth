import { createTransport } from "nodemailer";
import generateOtp from "./code.ts";
import { config } from "dotenv";
config();
import { saveVerificationCode, deleteVerificationCode } from "../db/dbUtils.ts";

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

async function sendEmail(recepientEmail: string) {
  try {
    if (!recepientEmail) {
      throw new Error(
        "do not call sendEmail function without recepientEmail parameter"
      );
    }

    const code = await generateOtp(5);

    const mailOptions = {
      from: fromEmail,
      to: recepientEmail,
      subject: "Auth-SSR verification code",
      html: `verification code: ${code}`,
    };

    // without callback following function returns promise object
    const result = await transporter.sendMail(mailOptions);

    if (!result.messageId) {
      throw new Error("Error in sending email");
    }

    //TODO store recepient email and code in cache memory
    await saveVerificationCode(recepientEmail, code);

    //TODO delete email and otp from cache memory after 1min
    setTimeout(async () => {
      await deleteVerificationCode(recepientEmail);
    }, 60000);

    console.log(`Email sent to ${recepientEmail}: `, result.response);
    return true;
  } catch (err) {
    console.error(`Error in sending email to ${recepientEmail}: `, err);
    throw err;
  }
}

export default sendEmail;
