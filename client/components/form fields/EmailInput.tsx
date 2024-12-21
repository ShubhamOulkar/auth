import React, { memo } from "react";
import { Label } from "../ComponentExpoter";

const EmailInput = memo(function EmailInput({
  data,
  error,
  autofocus,
}: {
  data: string;
  error: string;
  autofocus?: boolean;
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
        aria-describedby="emailErr"
        name="email"
        defaultValue={data}
      />
    </>
  );
});

export default EmailInput;
