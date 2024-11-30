import clientPostRequest from "../utilities/clientPostRequest";
import getCookie from "../utilities/getCookie";
import { ClientCredential } from "../types/clientCredentialType";
import encryptBody from "../utilities/encryptBody";

const endpoint = import.meta.env.VITE_GOOGLE_LOGIN_ENDPOINT;
const cookieName = import.meta.env.VITE_CSRF_COOKIE_NAME;

async function sendGoogleIndentity(response: { credential: any }) {
  try {
    // get csrf token
    const csrfValue = getCookie(cookieName);

    // post request body object
    const body: ClientCredential = {
      googleId: response.credential,
      csrfToken: csrfValue,
    };

    //encrypt body object
    const bodyEnc = await encryptBody(body);

    // send data to server
    if (bodyEnc) {
      let response = await clientPostRequest(endpoint, bodyEnc);

      if (response.success) {
        window.location = response.redirect;
      } else {
        //@ts-ignore
        window.location = "/login";
      }
    }
  } catch (err) {
    console.error("Error in sending token to server", err);
  }
}

export default sendGoogleIndentity;
