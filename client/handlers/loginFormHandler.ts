import { LoginInputs } from "../types/formFieldsTypes";
import { ClientCredential } from "../types/clientCredentialType";
import getCookie from "../utilities/getCookie";
import clientPostRequest from "../utilities/clientPostRequest";
import encryptBody from "../utilities/encryptBody";
import { loginFormHandlerType } from "../types/LoginFormHandlerType";
import { CLientErrorType, NotificationType } from "../types/notificationType";

const endpoint: string = import.meta.env.VITE_LOGIN_ENDPOINT;
const cookieName: string = import.meta.env.VITE_CSRF_COOKIE_NAME;

const loginFormHandler = async (
  data: LoginInputs
): Promise<loginFormHandlerType> => {
  try {
    // get session id and csrf token
    const csrfValue: string | CLientErrorType = getCookie(cookieName);

    //@ts-ignore
    if (typeof csrfValue === "object" && !csrfValue?.success) {
      return csrfValue;
    }

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

    console.log("login form bodyEnc: ", bodyEnc);

    // send data to server
    if (typeof bodyEnc === "string") {
      let response: loginFormHandlerType = await clientPostRequest(
        endpoint,
        bodyEnc
      );

      if (response.success) {
        return response;
      } else {
        return response; //error data
      }
    }
  } catch (err) {
    console.error("Error is sending user credentials", err);
  }

  // default return
  return {
    success: false,
    err_msg: "An unknown error occurred in login form handler",
  } as CLientErrorType;
};

export default loginFormHandler;
