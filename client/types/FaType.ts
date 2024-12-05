import { BlobOptions } from "buffer";
import { FaEmailSchema, FaPasswordResetSchema } from "../validation/2FaSchema";
import z from "zod";

export type FaContext = "forgot password" | "verify email";

export type FaType = {
  fa: boolean;
  setFa: React.Dispatch<React.SetStateAction<boolean>>;
  isEmailVerified: boolean;
  setEmailVerification: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  twoFaContext: FaContext;
  setTwoFaContext: React.Dispatch<React.SetStateAction<FaContext>>;
  sending: boolean;
  setSending: React.Dispatch<React.SetStateAction<boolean>>;
  isOtpEmailSend: boolean;
  setOtpEmailSend: React.Dispatch<React.SetStateAction<boolean>>;
  reset2FaContext: () => void;
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
