import React,{ memo, useState } from "react";
import TogglePasswordBtn from "../ShowPassword";

export const PasswordInput = memo(function PasswordInput({
  fieldName,
  data,
  error,
  disabled,
}: {
  fieldName: string;
  data: string;
  error: boolean;
  disabled?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="password-container">
        <input
          id={fieldName}
          type={showPassword ? "text" : "password"}
          className={error ? "invalid" : ""}
          autoComplete={
            fieldName === "password"
              ? "current-password webauthn"
              : "new-password webauthn"
          }
          aria-describedby={`${fieldName}Err`}
          name={fieldName}
          defaultValue={data}
          disabled={disabled}
        />
        <TogglePasswordBtn
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>
    </>
  );
});

export default PasswordInput;
