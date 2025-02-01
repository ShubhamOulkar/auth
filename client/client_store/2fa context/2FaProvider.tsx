import React, { useState } from "react";
import faContext from "./create2faContext";
import { useNotificationContext } from "../context/customUseContextExporters";
import { PropsWithChildren } from "react";

/**
 * A two factor auth provider
 *
 * @param {JSX.Element} Component as a child
 * @returns {JSX.Element} A 2FA provider element
 */

const FaProvider = ({ children }: PropsWithChildren) => {
  const [email, setEmail] = useState<string>(""); // email for varification
  const [isOtpEmailSend, setOtpEmailSend] = useState(false);
  const [timerStatus, setTimerStatus] = useState(false);
  const [otpStatus, setOtpStatus] = useState(""); //css class selector
  const { setNotification } = useNotificationContext();

  const reset2FaContext = () => {
    setEmail("");
    setNotification(undefined);
    setOtpEmailSend(false);
    setOtpStatus("");
    setTimerStatus(false);
  };

  return (
    <faContext.Provider
      value={{
        email,
        setEmail,
        isOtpEmailSend,
        setOtpEmailSend,
        timerStatus,
        setTimerStatus,
        reset2FaContext,
        otpStatus,
        setOtpStatus,
      }}
    >
      {children}
    </faContext.Provider>
  );
};

export default FaProvider;
