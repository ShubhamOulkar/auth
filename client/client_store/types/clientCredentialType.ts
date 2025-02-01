import { LoginInputs, SignupInputs } from "./formFieldsTypes";
import { CLientErrorType } from "./notificationType";
import { UserType } from "./userType";
import {
  FaEmailInput,
  FaPasswordResetInputs,
  FaOtpInput,
} from "../types/FaType";

export type ClientCredential = {
  googleId?: string;
  csrfToken: string | CLientErrorType;
  formData?:
    | LoginInputs
    | SignupInputs
    | FaEmailInput
    | FaPasswordResetInputs
    | FaOtpInput;
  userData?: UserType | null;
  authKey?: string | CLientErrorType;
  btnName?: string;
};
