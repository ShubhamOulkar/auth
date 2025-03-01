import clientPostRequest from "../utilities/clientPostRequest";
import encryptBody from "../utilities/encryptBody";
import getCookie from "../utilities/getCookie";
import { ClientCredential } from "../types/clientCredentialType";
import { UserType } from "../types/userType";
import { CLientErrorType } from "../types/notificationType";
import { LogoutHandlerType } from "../types/LogoutHandlerType";
import {
  localStorageName,
  csrfCookieName,
  authenticationKey,
  logoutEndpoint,
  deleteEndpoint,
} from "../env";

async function logoutHandler(btnName: string): Promise<LogoutHandlerType> {
  try {
    // get localstorage data
    const user: string | null = localStorage.getItem(localStorageName);

    if (!user) {
      return {
        success: false,
        err_msg: "local storage is empty",
      } as CLientErrorType;
    }

    const userObject: UserType = user && JSON.parse(user);

    // get auth key
    const authKey: string | CLientErrorType = getCookie(authenticationKey);

    //@ts-ignore
    if (typeof authKey === "object" && !authKey?.success) {
      return authKey;
    }

    //get csrf cookie
    const csrfCookie = getCookie(csrfCookieName);

    //@ts-ignore
    if (typeof csrfCookie === "object" && !csrfCookie?.success) {
      return csrfCookie;
    }

    // add user data , auth key and csrf token in post body
    const body: ClientCredential = {
      csrfToken: csrfCookie,
      userData: userObject,
      authKey: authKey,
      btnName: btnName.toLowerCase() === "logout" ? "" : "delete",
    };

    // encrypt body object
    const bodyEnc = await encryptBody(body);

    if (typeof bodyEnc === "object" && !bodyEnc?.success) {
      return bodyEnc;
    }

    // send data to server
    if (typeof bodyEnc === "string") {
      let response: LogoutHandlerType = await clientPostRequest(
        btnName.toLowerCase() === "logout" ? logoutEndpoint : deleteEndpoint,
        bodyEnc
      );

      return response;
    }
  } catch (err) {
    console.error("Error sending logout request", err);
  }

  // default return
  return {
    success: false,
    err_msg: "An unknown error occurred in logout form handler",
  } as CLientErrorType;
}

export default logoutHandler;
