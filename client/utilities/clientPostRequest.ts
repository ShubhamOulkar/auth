import { json } from "stream/consumers";

async function clientPostRequest(
  endpoint: string,
  bodyEnc: string | undefined
) {
  const requestInit = {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: bodyEnc,
    credentials: "same-origin" as RequestCredentials,
  };

  try {
    const response = await fetch(endpoint, requestInit);

    const data = await response.json();

    // console.log(`response from server => ${JSON.stringify(data)}`);

    if (data?.success) {
      // if response is success return data
      return data;
    }
  } catch (err) {
    console.error("error in client post request:", err);
  }
}

export default clientPostRequest;
