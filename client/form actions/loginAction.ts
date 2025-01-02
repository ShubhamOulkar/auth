import { InitialStatus } from "../types/FormInitialStatus";
import { LoginFormSchema } from "../validation/loginFormSchema";
import loginFormHandler from "../handlers/loginFormHandler";
import { loginFormHandlerType } from "../types/LoginFormHandlerType";
import { NavigateFunction } from "react-router-dom";
import { FieldErrors } from "../types/FormFieldErrors";
import { SetStateAction } from "react";
import { FaContext } from "../types/FaType";

export const emptyFields = { email: "", password: "" }; //initial form fields are empty

export default function loginAction(
  setError: React.Dispatch<React.SetStateAction<FieldErrors>>,
  setNotification: (arg0: loginFormHandlerType) => void,
  setFa: React.Dispatch<React.SetStateAction<boolean>>,
  setTwoFaContext: {
    (value: SetStateAction<FaContext>): void;
  },
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  navigate: NavigateFunction
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
        success: false,
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
      // set two factor context
      setTwoFaContext("verify email");
      // enable two factor auth
      setFa(true);
      // set email context
      setEmail(validation.data.email);
      //navigate to redirect route provided by server
      //@ts-ignore
      response?.success && navigate(response?.redirect);
      // return form status true i.e. sumitted successfully
      return {
        success: true,
        data: emptyFields, // reset form fields
        formSubmittedCount: formSubmittedCount,
      } as InitialStatus;
    }

    // TODO server response is false then set error and return
    //! update following code is email and password are both invalid
    const err = response.err_msg?.includes("@")
      ? { email: [response.err_msg || ""] }
      : { password: [response.err_msg || ""] };
    setError(err);
    return {
      success: false,
      data: data,
      formSubmittedCount: formSubmittedCount,
    } as InitialStatus;
  };
}
