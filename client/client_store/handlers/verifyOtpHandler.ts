import { FaOtpInput } from "../types/FaType";
import { CLientErrorType, NotificationType } from "../types/notificationType";
import {
  getCookie,
  encryptBody,
  clientPostRequest,
} from "../utilities/utilitiesExporter";
import { ClientCredential } from "../types/clientCredentialType";
import { verifyOtpEndpoint, csrfCookieName } from "../env";

type VerifyOtpFormHandlerType = CLientErrorType | NotificationType;

async function verifyOtpHandler(data: FaOtpInput) {
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
      let response = await clientPostRequest(verifyOtpEndpoint, bodyEnc);

      return response;
    }
  } catch (err) {
    console.error("Error is sending otp for email verification:", err);
  }

  // default return
  return {
    success: false,
    err_msg: "An unknown error occurred in verify otp handler",
  };
}

export default verifyOtpHandler;
