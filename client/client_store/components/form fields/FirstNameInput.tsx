import { memo } from "react";
import { Label } from "../ComponentExpoter";

const FirstNameInput = memo(
  ({
    data,
    error,
    autofocus,
  }: {
    data: string;
    error: boolean;
    autofocus?: boolean;
  }) => {
    return (
      <>
        <input
          name="firstName"
          id="firstName"
          type="text"
          className={error ? "invalid" : ""}
          autoFocus={autofocus}
          aria-describedby="firstNameErr"
          defaultValue={data}
        />
      </>
    );
  }
);

export default FirstNameInput;
