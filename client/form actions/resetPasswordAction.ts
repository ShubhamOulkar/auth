import { InitialStatus } from "../types/FormInitialStatus";
import newPasswordFormHandler from "../handlers/newPasswordFormHandler";
import { NewPasswordFormSchema } from "../validation/signupFormSchema";
import { NavigateFunction } from "react-router-dom";
import { FieldErrors } from "../types/FormFieldErrors";
import { SetStateAction } from "react";
import { NotificationType, CLientErrorType } from "../types/notificationType";

export default function resetPasswordAction(
  email: string,
  setError: React.Dispatch<React.SetStateAction<FieldErrors>>,
  setNotification: {
    (value: SetStateAction<NotificationType | undefined>): void;
    (arg0: CLientErrorType | NotificationType): void;
  },
  setFa: React.Dispatch<React.SetStateAction<boolean>>,
  reset2FaContext: { (): void; (): void },
  navigate: NavigateFunction
) {
  return async (previousState: any, formData: FormData) => {
    const data = {
      password: formData.get("password") || "",
      confirmPassword: formData.get("confirmPassword") || "",
    };
    // validate passwords
    const validate = await NewPasswordFormSchema.safeParseAsync(data);
    if (!validate.success) {
      setError(validate.error.flatten().fieldErrors);
      return {
        success: false,
        data: data,
      } as InitialStatus;
    }

    // send data to endpoint
    const newData = { ...validate.data, email };

    const response = await newPasswordFormHandler(newData);
    // on success response, enable code varification form
    setNotification(response);

    if (response.success) {
      reset2FaContext();
      setFa(false);
      // set error undefined on validation success
      setError(undefined);
      //@ts-ignore
      navigate(response.redirect);
      return {
        success: response.success,
      } as InitialStatus;
    }

    //return form status false
    setError({ password: [response.err_msg || ""] });
    return {
      success: false,
    } as InitialStatus;
  };
}
