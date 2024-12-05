import React from "react";
import { Label } from "../components/ComponentExpoter";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaEmailSchema } from "../validation/2FaSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEmailInput } from "../types/FaType";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import verifyEmailFormHandler from "../handlers/varifyEmailFormHandler";

function EmailForm() {
  const { setNotification } = useNotificationContext();
  const { email, setEmail, twoFaContext, setOtpEmailSend } = use2FaContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<FaEmailInput>({
    defaultValues: { email: email || "" }, // default values for input field
    resolver: zodResolver(FaEmailSchema),
  });

  const onSubmit: SubmitHandler<FaEmailInput> = async (data) => {
    // send data to endpoint
    console.log("email send for verification:", data);

    const response = await verifyEmailFormHandler(data);
    console.log("response from /verifyemail:", response);

    setNotification(response);

    if (response.success) {
      // set 2fa user email for reset password
      setEmail(data.email);

      // set otp send to user email true
      setOtpEmailSend(true);
    }

    //note redirect to /login is handled in send otp form.
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <Label
          label="Enter email address"
          labelFor="email"
          errorsObj={errors}
        />
        <input
          id="email"
          type="email"
          className={errors?.email && "invalid"}
          autoComplete="email webauthn"
          autoFocus={true}
          aria-describedby="emailErr"
          {...register("email")}
          disabled={twoFaContext === "verify email"}
        />

        <button type="submit" disabled={Object.keys(errors).length !== 0}>
          {isSubmitting ? "Sending code..." : "Send verification code"}
        </button>
      </form>
      <p className="card-link">
        {isSubmitted
          ? `A verification code has been send to ${email}. `
          : "Verification code is not send. Click on send verification code. "}
        Enter the code to continue and be redirected.
      </p>
    </>
  );
}

export default EmailForm;
