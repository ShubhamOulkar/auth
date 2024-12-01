import { LoginInputs, SignupInputs } from "./formFieldsTypes";
import { CLientErrorType } from "./notificationType";
import { UserType } from "./userType";

export type ClientCredential = {
  googleId?: string;
  csrfToken: string | CLientErrorType;
  formData?: LoginInputs | SignupInputs;
  userData?: UserType | null;
  authKey?: string | CLientErrorType;
  btnName?: string;
};
