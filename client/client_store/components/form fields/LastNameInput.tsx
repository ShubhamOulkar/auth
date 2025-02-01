import { memo } from "react";
import { Label } from "../ComponentExpoter";

const LastNameInput = memo(
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
        <Label label="User last name" labelFor="lastName" error={error} />

        <input
          name="lastName"
          id="lastName"
          type="text"
          className={error && "invalid"}
          aria-describedby="lastNameErr"
          defaultValue={data}
          autoFocus={autofocus}
        />
      </>
    );
  }
);

export default LastNameInput;
