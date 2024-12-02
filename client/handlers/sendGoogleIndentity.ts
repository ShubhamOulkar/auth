import clientPostRequest from "../utilities/clientPostRequest";
import getCookie from "../utilities/getCookie";
import { ClientCredential } from "../types/clientCredentialType";
import encryptBody from "../utilities/encryptBody";
import { GoogleCredentialResponse } from "../types/GoogleCredentialResponse";
import { storeInLocalStorage } from "../utilities/storeInLocalStorage";

const endpoint = import.meta.env.VITE_GOOGLE_LOGIN_ENDPOINT;
const cookieName = import.meta.env.VITE_CSRF_COOKIE_NAME;

async function sendGoogleIndentity(
  response: GoogleCredentialResponse
): Promise<void> {
  console.log("Google response:", response);
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

    console.log("google auth bodyEnc: ", bodyEnc);

    // send data to server
    if (typeof bodyEnc === "string") {
      let response = await clientPostRequest(endpoint, bodyEnc);

      // on successfull user verification
      if (response?.success) {
        // TODO set auth false if authorization faild
        //@ts-ignore
        // response?.success ? setAuth(true) : setAuth(false);

        // store user auth data in localstorage
        //@ts-ignore
        storeInLocalStorage(response.user);

        //TODO set notification for client (show errors as well as success)
        // setNotification(response);

        // rediect to profile page
        //@ts-ignore
        window.location = response?.redirect;
      } else {
        // on failed verification
        //@ts-ignore
        window.location = "/login";
      }
    }
  } catch (err) {
    console.error("Error in sending token to server", err);
  }
}

export default sendGoogleIndentity;
