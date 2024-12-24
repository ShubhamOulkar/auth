import { SignupFormSchema } from "../validation/signupFormSchema";
import { InitialStatus } from "../types/FormInitialStatus";
import signupFormHandler from "../handlers/signupFormHandler";
import { SignupFormHandlerType } from "../types/SignupFormHandlerType";
import { FieldErrors } from "../types/FormFieldErrors";
import { NotificationType } from "../types/notificationType";
import { NavigateFunction } from "react-router-dom";

export default function signupAction(
  setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationType | undefined>
  >,
  navigate: NavigateFunction
) {
  return async (previousState, formData: FormData) => {
    const data = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      confirmPassword: formData.get("confirmPassword")?.toString() || "",
    };

    // validate form data
    const validation = await SignupFormSchema.safeParseAsync(data);
    if (!validation.success) {
      const { fieldErrors } = validation.error.flatten();
      setErrors(fieldErrors);
      // on form invalid
      const returnFormFields: InitialStatus = {
        success: false,
        data: data, // this form data is used to fill form fields on failed validation
        formSubmittedCount: 1,
      };
      // return form invalid status
      return returnFormFields;
    }

    let response: SignupFormHandlerType = await signupFormHandler(
      validation.data
    );

    // generate notification (show errors as well as success message)
    setNotification(response);

    // if response from server is false then return form failed status as false
    if (!response?.success) {
      // TODO problem with below code is that email in highligthed for all types of server reponse errors, do proper error handling according to server responsee error
      //show server errors on form fields like email is already exist
      setErrors({ email: [response.err_msg || ""] });
      //above error object to highlight email is already exist
      return {
        success: response.success,
        data: data,
        formSubmittedCount: 1,
      } as InitialStatus;
    }

    // if form response is true then navigate to login page
    //@ts-ignore
    navigate(response?.redirect);

    // return form status true
    return {
      success: true,
      formSubmittedCount: 1,
    } as InitialStatus;
  };
}
