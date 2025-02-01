import React, { useEffect, useRef } from "react";
import { NotificationType } from "../types/notificationType";
export default function OTPComponent({
  setNotification,
  isOtpEmailSend,
  otpStatus,
  otpAction,
  setSending,
  otp,
  setOtp,
  sending,
}: {
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationType | undefined>
  >;
  isOtpEmailSend: boolean;
  otpStatus: string;
  otpAction: () => Promise<void>;
  sending: boolean;
  setSending: React.Dispatch<React.SetStateAction<boolean>>;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const inputRefs = useRef<HTMLInputElement[]>([]); // Array of refs for each input field
  useEffect(() => {
    otpStatus === "not verified" && inputRefs.current[0].focus();
  }, [otpStatus]);

  useEffect(() => {
    if (isOtpEmailSend) {
      inputRefs.current[0].focus();
    }
  }, [isOtpEmailSend]);

  useEffect(() => {
    if (otp.join("").length === otp.length) {
      setSending(true);
      (async () => {
        await otpAction();
      })();
    }
  }, [otp]);

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
      <p>
        Enter the code to continue and be redirected. {sending && "sending..."}
      </p>

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
