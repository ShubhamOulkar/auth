import React, { memo } from "react";
import { Label } from "../ComponentExpoter";

const FirstNameInput = memo(
  ({
    data,
    error,
    autofocus,
  }: {
    data: string;
    error: string;
    autofocus?: boolean;
  }) => {
    return (
      <>
        <Label label="User first name" labelFor="firstName" error={error} />

        <input
          name="firstName"
          id="firstName"
          type="text"
          className={error && "invalid"}
          autoFocus={autofocus}
          aria-describedby="firstNameErr"
          defaultValue={data}
        />
      </>
    );
  }
);

export default FirstNameInput;
