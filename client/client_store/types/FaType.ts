import { BlobOptions } from "buffer";
import { FaEmailSchema, FaPasswordResetSchema } from "../validation/2FaSchema";
import z from "zod";

export type FaContext = "forgot password" | "verify email";

export type FaType = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  isOtpEmailSend: boolean;
  setOtpEmailSend: React.Dispatch<React.SetStateAction<boolean>>;
  timerStatus: boolean;
  setTimerStatus: React.Dispatch<React.SetStateAction<boolean>>;
  reset2FaContext: () => void;
  otpStatus: string;
  setOtpStatus: React.Dispatch<React.SetStateAction<string>>;
};

// type of verify email form fields
export type FaEmailInput = z.infer<typeof FaEmailSchema>;

// type of reset new password form fields
export type FaPasswordResetInputs = z.infer<typeof FaPasswordResetSchema>;

// type of otp
export type FaOtpInput = {
  otp: string;
  email: string;
};
