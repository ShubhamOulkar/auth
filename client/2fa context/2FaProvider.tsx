import React, { useState, useEffect } from "react";
import faContext from "./create2faContext";
import { useNotificationContext } from "../context/customUseContextExporters";
import { FaContext } from "../types/FaType";

const FaProvider = ({ children }) => {
  const [fa, setFa] = useState<boolean>(false); // enabe 2FA
  const [isEmailVerified, setEmailVerification] = useState<boolean>(false); // this is used by profile page and new password page
  const [email, setEmail] = useState<string>(""); // email for varification
  const [twoFaContext, setTwoFaContext] =
    useState<FaContext>("forgot password"); // 2FA enabled by forgot password or login user form
  const [sending, setSending] = useState(false); // sending fetch request status
  const [isOtpEmailSend, setOtpEmailSend] = useState(false);
  const { setNotification } = useNotificationContext();

  const reset2FaContext = () => {
    setEmailVerification(false);
    setEmail("");
    setNotification(undefined);
    setOtpEmailSend(false);
    setTwoFaContext("forgot password"); // default is same
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/verifyemail" || path === "/newpassword") {
      window.addEventListener("popstate", reset2FaContext);
    }

    return () => {
      window.removeEventListener("popstate", reset2FaContext);
    };
  }, [isEmailVerified, email]);

  return (
    <faContext.Provider
      value={{
        fa,
        setFa,
        isEmailVerified,
        setEmailVerification,
        email,
        setEmail,
        twoFaContext,
        setTwoFaContext,
        sending,
        setSending,
        isOtpEmailSend,
        setOtpEmailSend,
        reset2FaContext,
      }}
    >
      {children}
    </faContext.Provider>
  );
};

export default FaProvider;
