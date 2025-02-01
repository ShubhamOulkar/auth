import { LoginInputs } from "../types/formFieldsTypes";
import { ClientCredential } from "../types/clientCredentialType";
import getCookie from "../utilities/getCookie";
import clientPostRequest from "../utilities/clientPostRequest";
import encryptBody from "../utilities/encryptBody";
import { loginFormHandlerType } from "../types/LoginFormHandlerType";
import { CLientErrorType } from "../types/notificationType";
import { loginEndpoint, csrfCookieName } from "../env";

const loginFormHandler = async (
  data: LoginInputs
): Promise<loginFormHandlerType> => {
  try {
    // get session id and csrf token
    const csrfValue: string | CLientErrorType = getCookie(csrfCookieName);

    //@ts-ignore
    if (typeof csrfValue === "object" && !csrfValue?.success) {
      return csrfValue; // return error object
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

    // send data to server
    if (typeof bodyEnc === "string") {
      let response: loginFormHandlerType = await clientPostRequest(
        loginEndpoint,
        bodyEnc
      );

      return response;
    }
  } catch (err) {
    console.error("Error is sending user credentials for login form", err);
  }

  // default return
  return {
    success: false,
    err_msg: "An unknown error occurred in login form handler",
  } as CLientErrorType;
};

export default loginFormHandler;
