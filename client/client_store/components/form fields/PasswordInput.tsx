import { memo, useState } from "react";
import { Label, TogglePasswordBtn } from "../ComponentExpoter";

export const PasswordInput = memo(function PasswordInput({
  fieldName,
  data,
  error,
  disabled,
}: {
  fieldName: string;
  data: string;
  error: string;
  disabled: boolean;
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
