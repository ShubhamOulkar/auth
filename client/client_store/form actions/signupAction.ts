import { SignupFormSchema } from "../validation/signupFormSchema";
import { InitialStatus } from "../types/FormInitialStatus";
import signupFormHandler from "../handlers/signupFormHandler";
import { SignupFormHandlerType } from "../types/SignupFormHandlerType";
import { FieldErrors } from "../types/FormFieldErrors";
import { emptyFields } from "../pages/SignupPage";
import { NotificationType } from "../types/notificationType";

export default function signupAction(
  setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationType | undefined>
  >
) {
  return async (
    previousState: InitialStatus,
    formData: FormData
  ): Promise<InitialStatus> => {
    console.log("signupAction");
    const formSubmittedCount = (previousState.formSubmittedCount ?? 0) + 1;
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
        formSubmittedCount: formSubmittedCount,
      };
      // return form invalid status
      return returnFormFields;
    }

    let response: SignupFormHandlerType = await signupFormHandler(
      validation.data
    );

    // generate notification (show server errors as well as success message)
    setNotification(response);

    // if response from server is false then return form failed status as false
    if (!response?.success) {
      //show server errors on form fields like email is already exist
      setErrors({ email: [response.err_msg || ""] });
      //above error object to highlight email is already exist
      return {
        success: response.success,
        data: data,
        formSubmittedCount: formSubmittedCount,
      } as InitialStatus;
    }

    // if form response is true then navigate to login page
    //@ts-ignore
    window.location.assign(response?.redirect);

    // return form status true on response success
    return {
      success: true,
      data: emptyFields, //reset form fields
      formSubmittedCount: formSubmittedCount,
    } as InitialStatus;
  };
}
