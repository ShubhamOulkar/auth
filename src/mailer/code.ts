import { config } from "dotenv";
config();

async function generateOtp(lengthOfCode: number) {
  try {
    // throw error if parameter is "" or not given or zero(0)
    // if (!lengthOfCode) {
    //   throw new Error("function needs parameter lengthOfOtp");
    // }
    // throw error if parameter is not number
    // if (typeof lengthOfCode === "string") {
    //   throw new Error("lengthOfCode must be a number.");
    // }

    const otp: string[] = [];
    const characters = process.env.OTP_CHARACTERS ?? "";
    // random unsigned integer array of lengthOfCode
    const randomValueArray = crypto.getRandomValues(
      new Uint32Array(lengthOfCode)
    );

    randomValueArray.forEach((value) => {
      //index can not be grater than length
      const index = value % characters.length;
      otp.push(characters.charAt(index));
    });

    return otp.join("");
  } catch (error) {
    // Handle the error
    console.error("Failed to generate OTP:", error);
    throw error;
  }
}

export default generateOtp;
