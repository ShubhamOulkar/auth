import React, { memo } from "react";
import { Label } from "../ComponentExpoter";

const EmailInput = memo(function EmailInput({
  data,
  error,
  autofocus,
  disabled,
  readOnly,
}: {
  data: string;
  error: string;
  autofocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <>
      <Label label="Enter email address" labelFor="email" error={error} />
      <input
        id="email"
        type="email"
        className={error && "invalid"}
        autoComplete="email webauthn"
        autoFocus={autofocus}
        disabled={disabled}
        aria-describedby="emailErr"
        name="email"
        defaultValue={!readOnly ? data : undefined}
        value={readOnly ? data : undefined}
        readOnly={readOnly}
      />
    </>
  );
});

export default EmailInput;
