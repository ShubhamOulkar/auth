import React, { memo } from "react";

const EmailInput = memo(function EmailInput({
  data,
  autofocus,
  disabled,
  error,
  readOnly,
}: {
  data: string;
  error:boolean;
  autofocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <>
      <input
        id="email"
        type="email"
        className={error ? "invalid" : ""}
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
