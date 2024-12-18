/// <reference types="vite/client" />

import { FaPasswordResetInputs } from "../types/FaType";
import { CLientErrorType, NotificationType } from "../types/notificationType";
import {
  getCookie,
  encryptBody,
  clientPostRequest,
} from "../utilities/utilitiesExporter";
import { ClientCredential } from "../types/clientCredentialType";
import { resetPasswordEndpoint, csrfCookieName } from "../env";

type NewPasswordFormHandlerType = CLientErrorType | NotificationType;

async function newPasswordFormHandler(
  data: FaPasswordResetInputs
): Promise<NewPasswordFormHandlerType> {
  try {
    // get session id and csrf token
    const csrfValue: string | CLientErrorType = getCookie(csrfCookieName);

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

    console.log("reset password form bodyEnc: ", bodyEnc);

    // send data to server
    if (typeof bodyEnc === "string") {
      let response: NewPasswordFormHandlerType = await clientPostRequest(
        resetPasswordEndpoint,
        bodyEnc
      );

      return response;
    }
  } catch (err) {
    console.error(
      "Error is sending user credentials for reset password form:",
      err
    );
  }

  // default return
  return {
    success: false,
    err_msg: "An unknown error occurred in reset password form handler",
  } as CLientErrorType;
}

export default newPasswordFormHandler;
