import { LoginInputs, SignupInputs } from "./formFieldsTypes";

export type ClientCredential = {
  googleId?: string;
  csrfToken: string | Error;
  formData?: LoginInputs | SignupInputs;
};
