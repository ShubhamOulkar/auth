import { SubmitHandler } from "react-hook-form";
import { LoginInputs } from "../types/formFieldsTypes";
import { ClientCredential } from "../types/clientCredentialType";
import getCookie from "../utilities/getCookie";
import clientPostRequest from "../utilities/clientPostRequest";
import encryptBody from "../utilities/encryptBody";

const endpoint: string = import.meta.env.VITE_LOGIN_ENDPOINT;
const cookieName: string = import.meta.env.VITE_CSRF_COOKIE_NAME;

const loginFormHandler: SubmitHandler<LoginInputs> = async (data) => {
  try {
    // get session id and csrf token
    const csrfValue = getCookie(cookieName);

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

    console.log("login form bodyEnc: ", bodyEnc);

    // send data to server
    if (bodyEnc) {
      let response = await clientPostRequest(endpoint, bodyEnc);

      if (response.success) {
        return response;
      } else {
        return response; //error data
      }
    }
  } catch (err) {
    console.error("Error is sending user credentials", err);
  }
};

export default loginFormHandler;