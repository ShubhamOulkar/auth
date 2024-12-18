/// <reference types="vite/client" />

import clientPostRequest from "../utilities/clientPostRequest";
import getCookie from "../utilities/getCookie";
import { ClientCredential } from "../types/clientCredentialType";
import encryptBody from "../utilities/encryptBody";
import { GoogleCredentialResponse } from "../types/GoogleCredentialResponse";
import { storeInLocalStorage } from "../utilities/storeInLocalStorage";
import { NotificationType } from "../types/notificationType";
import { googleEndpoint, csrfCookieName } from "../env";

async function sendGoogleIndentity(
  response: GoogleCredentialResponse,
  setAuth: (auth: boolean) => void,
  setNotification: (notification: NotificationType) => void
): Promise<void> {
  try {
    // get csrf token
    const csrfValue = getCookie(csrfCookieName);

    //@ts-ignore
    if (typeof csrfValue === "object" && !csrfValue?.success) {
      setNotification(csrfValue);
      return;
    }

    // post request body object
    const body: ClientCredential = {
      googleId: response.credential,
      csrfToken: csrfValue,
    };

    //encrypt body object
    const bodyEnc = await encryptBody(body);

    if (typeof bodyEnc === "object" && !bodyEnc?.success) {
      setNotification(bodyEnc);
      return;
    }

    console.log("google auth bodyEnc: ", bodyEnc);

    // send data to server
    if (typeof bodyEnc === "string") {
      let response = await clientPostRequest(googleEndpoint, bodyEnc);

      // on success full user verification
      if (response?.success) {
        // store user auth data in localstorage
        //@ts-ignore
        storeInLocalStorage(response.user);

        // set auth false if authorization faild
        //@ts-ignore
        setAuth(true);

        // set notification for client (show errors as well as success)
        setNotification(response);

        // rediect to profile page
        //@ts-ignore
        window.location = response?.redirect;
      } else {
        // failed notification
        setNotification(response);

        // setAuth false
        //@ts-ignore
        setAuth(false);

        // on failed redirect to login page
        //@ts-ignore
        window.location = "/login";
      }
    }
  } catch (err) {
    console.error("Error in sending google token to server", err);
  }
}

export default sendGoogleIndentity;
