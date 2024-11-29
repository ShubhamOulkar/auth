import React, { useRef, useEffect } from "react";
import sendGoogleIndentity from "../handlers/sendGoogleIndentity";

const IdConfiguration = {
  //@ts-ignore
  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  callback: sendGoogleIndentity, // callback user by "popup" mode
  // login_uri: "http://127.0.0.1:5500/google/token", //login uri used by "redirect" mode
  context: "signup",
  ux_mode: "popup", // "popup""redirect"
  itp_support: true, // enable one tap UX on intelligent Tracking Prevention (ITP) browers like firefox, ios browsers.
  use_fedcm_for_prompt: true,
};

const ButtonConfiguration = {
  type: "standard", // "standard" "icon"
  theme: "outline", // "filled_black", //"filled_blue",
  text: "signin_with", //"signup_with", // "signin", //"continue_with", "signin_with"
  size: "large",
  shape: "square", //rectangular, pill, circle
  logo_alignment: "left", //"left", "right", "center"
  width: "300px", // max 400px
  locale: "en_IN",
  // click_listener: onClickHandler,
};

export default function GoogleBtn() {
  const googleRef = useRef<HTMLDivElement>(null);

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
      <div ref={googleRef} style={{ width: "inherit", marginBlock: 20 }}></div>
    </>
  );
}
