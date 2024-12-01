import clientPostRequest from "../utilities/clientPostRequest";
import encryptBody from "../utilities/encryptBody";
import getCookie from "../utilities/getCookie";
import { ClientCredential } from "../types/clientCredentialType";
import { UserType } from "../types/userType";
import { CLientErrorType } from "../types/notificationType";

async function logoutHandler(e: { preventDefault: any }, btnName: string) {
  e.preventDefault();
  console.log("performing Logout user");

  try {
    // get localstorage data
    const user: string | null = localStorage.getItem(
      import.meta.env.VITE_LOCALSTORAGE_NAME
    );

    if (!user) {
      return {
        success: false,
        err_msg: "local storage is empty",
      };
    }

    const userObject: UserType = user && JSON.parse(user);

    // get auth key
    // TODO use env variable for key
    const authKey: string | CLientErrorType = getCookie("key");

    //@ts-ignore
    if (typeof authKey === "object" && !authKey?.success) {
      return authKey;
    }

    //get csrf cookie
    const csrfCookie = getCookie(import.meta.env.VITE_CSRF_COOKIE_NAME);

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

    console.log(body);

    // encrypt body object
    const bodyEnc = await encryptBody(body);

    console.log("login form bodyEnc: ", bodyEnc);

    // send data to server
    if (bodyEnc) {
      let response = await clientPostRequest(
        import.meta.env.VITE_LOGOUT_ENDPOINT,
        bodyEnc
      );

      if (response.success) {
        return response;
      } else {
        return response; //error data
      }
    }
  } catch (err) {
    console.error("Error sending logout request", err);
  }
}

export default logoutHandler;
