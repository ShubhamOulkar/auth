import { LoginInputs, SignupInputs } from "./formFieldsTypes";
import { CLientErrorType } from "./notificationType";

export type ClientCredential = {
  googleId?: string;
  csrfToken: string | CLientErrorType;
  formData?: LoginInputs | SignupInputs;
};
