import React, { useState } from "react";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import verifyOtpHandler from "../handlers/verifyOtpHandler";
import OTPComponent from "./OTPComponent";
import { storeInLocalStorage } from "../utilities/storeInLocalStorage";

export default function SendOTPForm({
  redirectRoute,
  next,
}: {
  redirectRoute?: (arg0: string) => void;
  next: string;
}) {
  const { setNotification } = useNotificationContext();
  const { email, isOtpEmailSend, setTimerStatus, otpStatus, setOtpStatus } =
    use2FaContext();
  const [sending, setSending] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(5).fill("")); // Array with 5 empty strings

  const sendOtpToServer = async () => {
    const data = { otp: otp.join(""), email, next: next };
    const response = await verifyOtpHandler(data);

    setNotification(response);
    if (response.success) {
      if (!redirectRoute) {
        // disable timer from ui
        setTimerStatus(!response.success);
        // store user response in local storage
        //get profile page
        storeInLocalStorage(response.user || {});
        window.location.assign(response.redirect || "");
      } else {
        redirectRoute(response.redirect || ""); // react router navigates to reset password form
      }
    } else {
      setOtpStatus("not verified");
      setOtp(Array(5).fill(""));
    }
    setSending(false);
  };

  return (
    <OTPComponent
      setNotification={setNotification}
      otpAction={sendOtpToServer}
      isOtpEmailSend={isOtpEmailSend}
      otpStatus={otpStatus}
      sending={sending}
      setSending={setSending}
      otp={otp}
      setOtp={setOtp}
    />
  );
}
