import React, { useRef, useEffect } from "react";
import sendGoogleIndentity from "../handlers/sendGoogleIndentity";
import useAuthContext from "../auth context/useAuthContext";
import useNotificationContext from "../notification context/useNotificationContexxt";
import { GoogleCredentialResponse } from "../types/GoogleCredentialResponse";
import { googleClientId } from "../env";

export default function GoogleBtn() {
  const googleRef = useRef<HTMLDivElement>(null);
  const { setAuth } = useAuthContext();
  const { setNotification } = useNotificationContext();

  const IdConfiguration = {
    //@ts-ignore
    client_id: googleClientId,
    callback: (response: GoogleCredentialResponse) =>
      sendGoogleIndentity(response, setAuth, setNotification), // callback user by "popup" mode
    // login_uri: "http://127.0.0.1:5500/google/token", //login uri used by "redirect" mode
    context: "signup",
    ux_mode: "popup", // "popup" "redirect"
    itp_support: true, // enable one tap UX on intelligent Tracking Prevention (ITP) browers like firefox, ios browsers.
    use_fedcm_for_prompt: true,
  };

  const ButtonConfiguration = {
    type: "standard", // "standard" "icon"
    theme: "filled_blue", //"outline", // "filled_black", //"filled_blue",
    text: "signin_with", //"signup_with", // "signin", //"continue_with", "signin_with"
    size: "large",
    shape: "square", //rectangular, pill, circle
    logo_alignment: "left", //"left", "right", "center"
    // width: "400px", // max 400px
    locale: "en_IN",
    // click_listener: onClickHandler,
  };

  useEffect(() => {
    //  new GIS SDK is loaded in index.html, this script will add google object property on window object
    // <script src="https://accounts.google.com/gsi/client" async defer></script>
    //@ts-ignore
    window?.google?.accounts?.id.initialize(IdConfiguration); //initializes the Sign In With Google client
    //@ts-ignore
    window?.google?.accounts?.id.renderButton(
      googleRef.current,
      ButtonConfiguration
    );
    //@ts-ignore
    window.google.accounts.id.prompt();
  }, []);

  return (
    <>
      <div>OR</div>

      <div ref={googleRef} style={{ marginBlock: 10 }}></div>
    </>
  );
}
