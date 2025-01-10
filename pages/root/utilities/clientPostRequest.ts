import { NotificationType } from "../types/notificationType";
import { CLientErrorType } from "../types/notificationType";

async function clientPostRequest(
  endpoint: string,
  bodyEnc: string
): Promise<NotificationType | CLientErrorType> {
  const requestInit = {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: bodyEnc,
    credentials: "same-origin" as RequestCredentials,
  };

  try {
    const response: Response = await fetch(endpoint, requestInit);

    const data: NotificationType = await response.json();

    // console.log(`response from server => ${JSON.stringify(data)}`);

    return data;
  } catch (err) {
    console.error("error in client post request:", err);
  }

  // default return
  return {
    success: false,
    err_msg: "error in sending post request to the server",
  } as CLientErrorType;
}

export default clientPostRequest;
