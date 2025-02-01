import { InitialStatus } from "../types/FormInitialStatus";
import newPasswordFormHandler from "../handlers/newPasswordFormHandler";
import { NewPasswordFormSchema } from "../validation/signupFormSchema";
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
  reset2FaContext: { (): void; (): void }
) {
  return async (previousState: InitialStatus, formData: FormData) => {
    const data = {
      password: formData.get("password") || "",
      confirmPassword: formData.get("confirmPassword") || "",
    };
    // validate passwords
    const validate = await NewPasswordFormSchema.safeParseAsync(data);
    if (!validate.success) {
      setError(validate.error.flatten().fieldErrors);
      console.log(validate.error.flatten().fieldErrors);
      return {
        success: false,
        data: data,
      } as InitialStatus;
    }

    const newData = { ...validate.data, email };

    // send response to server
    const response = await newPasswordFormHandler(newData);

    // set notification
    setNotification(response);

    if (response.success) {
      // set error undefined on validation success
      setError(undefined);

      //@ts-ignore
      window.location.assign(response.redirect);

      reset2FaContext();

      return {
        success: response.success,
      } as InitialStatus;
    }

    //return form status false
    setError({ password: [response.err_msg || ""] });
    return {
      success: false,
      data: data,
    } as InitialStatus;
  };
}
