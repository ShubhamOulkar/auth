import { ClientCredential } from "../types/clientCredentialType";
import { SignupInputs } from "../types/formFieldsTypes";
import getCookie from "../utilities/getCookie";
import clientPostRequest from "../utilities/clientPostRequest";
import encryptBody from "../utilities/encryptBody";
import { NotificationType } from "../types/notificationType";
import { CLientErrorType } from "../types/notificationType";
import { SignupFormHandlerType } from "../types/SignupFormHandlerType";

const endpoint = import.meta.env.VITE_SIGNUP_ENDPOINT;
const cookieName = import.meta.env.VITE_CSRF_COOKIE_NAME;

const signupFormHandler = async (
  data: SignupInputs
): Promise<SignupFormHandlerType> => {
  try {
    // get session id and csrf token
    const csrfValue = getCookie(cookieName);

    //@ts-ignore
    if (typeof csrfValue === "object" && !csrfValue?.success) {
      return csrfValue;
    }

    // set confirmPassword to true
    data.confirmPassword = "true";

    // add session id and csrf token in post body
    const body: ClientCredential = {
      csrfToken: csrfValue,
      formData: data,
    };

    // encrypt body object
    const bodyEnc = await encryptBody(body);

    if (typeof bodyEnc === "object" && !bodyEnc?.success) {
      return bodyEnc;
    }

    console.log("signup form bodyEnc: ", bodyEnc);

    // send data to server
    if (typeof bodyEnc === "string") {
      let response: SignupFormHandlerType = await clientPostRequest(
        endpoint,
        bodyEnc
      );

      return response;
    }
  } catch (err) {
    console.error("Error is sending user credentials for signup form: ", err);
  }

  // default return
  return {
    success: false,
    err_msg: "An unknown error occurred in signup form handler",
  } as CLientErrorType;
};

export default signupFormHandler;
