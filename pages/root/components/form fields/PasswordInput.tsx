import React, { memo, useState } from "react";
import { Label, TogglePasswordBtn } from "../ComponentExpoter";

export const PasswordInput = memo(function PasswordInput({
  fieldName,
  data,
  error,
}: {
  fieldName: string;
  data: string;
  error: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Label
        label={`Enter ${
          fieldName === "confirmPassword" ? "Confirm password" : fieldName
        }`}
        labelFor={fieldName}
        error={error}
      />
      <div className="password-container">
        <input
          id={fieldName}
          type={showPassword ? "text" : "password"}
          className={error && "invalid"}
          autoComplete={
            fieldName === "password"
              ? "current-password webauthn"
              : "new-password webauthn"
          }
          aria-describedby={`${fieldName}Err`}
          name={fieldName}
          defaultValue={data}
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
