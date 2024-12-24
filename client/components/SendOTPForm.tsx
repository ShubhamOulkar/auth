import React, { useRef, useState, useEffect } from "react";
import {
  useAuthContext,
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import { useNavigate } from "react-router-dom";
import verifyOtpHandler from "../handlers/verifyOtpHandler";
import { storeInLocalStorage } from "../utilities/utilitiesExporter";

export default function SendOTPForm() {
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();
  const { setNotification } = useNotificationContext();
  const {
    setEmailVerification,
    email,
    twoFaContext,
    sending,
    setSending,
    isOtpEmailSend,
  } = use2FaContext();
  const [otp, setOtp] = useState<string[]>(Array(5).fill("")); // Array with 5 empty strings
  const inputRefs = useRef<HTMLInputElement[]>([]); // Array of refs for each input field
  const [otpStatus, setOtpStatus] = useState("");

  useEffect(() => {
    if (isOtpEmailSend) {
      inputRefs.current[0].focus();
    }
  }, [isOtpEmailSend]);

  useEffect(() => {
    if (otp.join("").length === otp.length) {
      setSending(true);
      let timer = setTimeout(async () => {
        await sendOtpToServer();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [otp]);

  const sendOtpToServer = async () => {
    const data = { otp: otp.join(""), email, twoFaContext };
    const response = await verifyOtpHandler(data);
    setNotification(response);
    if (response.success) {
      // on success response, enable code varification form
      setEmailVerification(response.success);
      if (twoFaContext === "verify email") {
        // set auth false if authorization faild
        //@ts-ignore
        response?.success ? setAuth(true) : setAuth(false);
        // store user auth data in localstorage
        //@ts-ignore
        response?.success && storeInLocalStorage(response.user);
      }
      //@ts-ignore
      navigate(response.redirect);
    } else {
      setOtpStatus("not verified");
      setOtp(Array(5).fill(""));
      inputRefs.current[0].focus();
    }

    setSending(false);
  };

  const handleKeyDown = (e: {
    key: string;
    metaKey: boolean;
    preventDefault: () => void;
    target: EventTarget;
  }) => {
    if (
      !/^[A-Z0-9]{1}$/.test(e.key) && // allows only capital letters and numbers keys
      e.key !== "Backspace" && // allow backspace
      e.key !== "Delete" && // allow delete
      e.key !== "Tab" && // allow tab
      e.key !== "Control" && // allow ctrl
      e.key !== "v" && // allow small v
      !e.metaKey // allow
    ) {
      e.preventDefault(); // STOP DEFAULT KEY PRESS EVENT TO HAPPEN FOR ABOVE KEY PRESS
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      // get index of current input field form ref array
      const { target } = e;
      const index = inputRefs.current.indexOf(target as HTMLInputElement);
      if (index >= 0 && index < otp.length && otp[index]) {
        // only update otp field state if current field is not empty
        otp[index] = "";
        setOtp([...otp]);
      }

      // focus input field previous to current field
      index > 0 && index < otp.length && inputRefs.current[index - 1].focus();
    }
  };

  const handleChangeInput = (e: { target: HTMLInputElement }) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);

    if (target.value) {
      // only update non empty string
      otp[index] = target.value;
      setOtp([...otp]);

      // focus input field next to current field
      index >= 0 &&
        index < otp.length - 1 &&
        inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e: {
    clipboardData: { getData: (arg0: string) => any };
  }) => {
    const text = e.clipboardData.getData("text");

    // only otp length text is allowed
    if (!new RegExp(`^[A-Z0-9]{${otp.length}}$`).test(text)) {
      setNotification({
        success: false,
        msg: `otp code must be of length 5: ${text}`,
      });
      return;
    }
    const digits = text.split("");
    setOtp(digits);

    // focus last field
    inputRefs.current[otp.length - 1].focus();
  };

  return (
    <div className="otp-container">
      <p>{sending && "sending..."}</p>
      <form className="otp-form">
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={value}
            onChange={handleChangeInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            ref={(el) => {
              if (el) inputRefs.current[index] = el as HTMLInputElement;
            }}
            className={`otp-field ${
              otpStatus === "not verified" ? "otpInvalid" : ""
            }`}
            disabled={!isOtpEmailSend}
            autoFocus={true}
          />
        ))}
      </form>
    </div>
  );
}
