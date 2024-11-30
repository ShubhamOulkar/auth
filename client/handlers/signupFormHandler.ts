import { ClientCredential } from "../types/clientCredentialType";
import { SignupInputs } from "../types/formFieldsTypes";
import getCookie from "../utilities/getCookie";
import clientPostRequest from "../utilities/clientPostRequest";
import encryptBody from "../utilities/encryptBody";

const endpoint = import.meta.env.VITE_SIGNUP_ENDPOINT;
const cookieName = import.meta.env.VITE_CSRF_COOKIE_NAME;

const signupFormHandler = async (data: SignupInputs) => {
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

    console.log("signup form bodyEnc: ", bodyEnc);

    // send data to server
    if (bodyEnc) {
      let response = await clientPostRequest(endpoint, bodyEnc);

      if (response.success) {
        return response;
      } else {
        return response;
      }
    }
  } catch (err) {
    console.error("Error is sending user credentials: ", err);
  }
};

export default signupFormHandler;
