/// <reference types="vite/client" />

import { FaEmailInput } from "../types/FaType";
import { CLientErrorType, NotificationType } from "../types/notificationType";
import {
  getCookie,
  encryptBody,
  clientPostRequest,
} from "../utilities/utilitiesExporter";
import { ClientCredential } from "../types/clientCredentialType";
import { verifyEmailEndpoint, csrfCookieName } from "../env";

export type VerifyEmailFormHandlerType = CLientErrorType | NotificationType;

async function verifyEmailFormHandler(
  data: FaEmailInput
): Promise<VerifyEmailFormHandlerType> {
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

    // send data to server
    if (typeof bodyEnc === "string") {
      let response: VerifyEmailFormHandlerType = await clientPostRequest(
        verifyEmailEndpoint,
        bodyEnc
      );

      return response;
    }
  } catch (err) {
    console.error(
      "Error is sending user credentials for varify email form:",
      err
    );
  }

  // default return
  return {
    success: false,
    err_msg: "An unknown error occurred in verify email form handler",
  } as CLientErrorType;
}

export default verifyEmailFormHandler;
