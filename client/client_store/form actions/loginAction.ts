import { InitialStatus } from "../types/FormInitialStatus";
import { LoginFormSchema } from "../validation/loginFormSchema";
import loginFormHandler from "../handlers/loginFormHandler";
import { loginFormHandlerType } from "../types/LoginFormHandlerType";
import { FieldErrors } from "../types/FormFieldErrors";
import { NotificationType } from "../types/notificationType";
import { emptyFields } from "../pages/LoginPage";
export default function loginAction(
  setError: React.Dispatch<React.SetStateAction<FieldErrors>>,
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationType | undefined>
  >,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setOtpEmailSend: React.Dispatch<React.SetStateAction<boolean>>,
  setTimerStatus: React.Dispatch<React.SetStateAction<boolean>>
): (previousState: any, formData: FormData) => Promise<InitialStatus> {
  return async (previousState: InitialStatus, formData: FormData) => {
    const formSubmittedCount = (previousState.formSubmittedCount ?? 0) + 1;
    const data = {
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
    };

    // validate form data
    const validation = LoginFormSchema.safeParse(data);
    if (!validation.success) {
      const { fieldErrors } = validation.error.flatten();
      setError(fieldErrors);
      // on form invalid
      const returnFormFields: InitialStatus = {
        success: validation.success,
        data: data, // this form data is used to fill form fields on failed validation
        formSubmittedCount: formSubmittedCount,
      };
      return returnFormFields;
    }

    const response: loginFormHandlerType = await loginFormHandler(
      validation.data
    );

    //set notification for client (show errors as well as success)
    setNotification(response);

    if (response.success) {
      setOtpEmailSend(true);
      setEmail(validation.data.email);
      setTimerStatus(true);
      return {
        success: response.success,
        data: validation.data, // do not reset form fields
        formSubmittedCount: formSubmittedCount,
      } as InitialStatus;
    }

    //@ts-ignore
    if (response.code === 429) {
      setTimerStatus(false);
    }
    // TODO server response is false then set error and return
    //! update following code is email and password are both invalid
    const err = response.err_msg?.includes("@")
      ? { email: [response.err_msg || ""] }
      : { password: [response.err_msg || ""] };
    setError(err);
    return {
      success: !response.success,
      data: emptyFields,
      formSubmittedCount: formSubmittedCount,
    } as InitialStatus;
  };
}
