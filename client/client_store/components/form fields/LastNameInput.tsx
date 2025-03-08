import { memo } from "react";
import { Label } from "../ComponentExpoter";

const LastNameInput = memo(
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
          name="lastName"
          id="lastName"
          type="text"
          className={error ? "invalid" : ""}
          aria-describedby="lastNameErr"
          defaultValue={data}
          autoFocus={autofocus}
        />
      </>
    );
  }
);

export default LastNameInput;
