import React, { useEffect, useActionState, useState, useCallback } from "react";
import {
  GoogleBtn,
  LoginBottomLinks,
  EmailInput,
  PasswordInput,
  SkeForm,
  SendOTPForm,
  Timer,
} from "../components/ComponentExpoter";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import loginAndSignupFormFieldsValidation from "../field validation handlers/loginAndSignupFormFieldsValidation";
import { InitialStatus } from "../types/FormInitialStatus";
import { FieldErrors } from "../types/FormFieldErrors";
import loginAction from "../form actions/loginAction";
import { Trans } from "@lingui/react/macro";

//initial form fields are empty
export const emptyFields = { email: "", password: "" };

const initialStatus: InitialStatus = {
  success: false,
  data: emptyFields,
  formSubmittedCount: 0,
};

function LoginPage() {
  const { setNotification } = useNotificationContext();
  const {
    isOtpEmailSend,
    timerStatus,
    setOtpEmailSend,
    setTimerStatus,
    setEmail,
  } = use2FaContext();
  // react 19 hooks
  const [error, setError] = useState<FieldErrors>();
  const [formStatus, formAction, isPending] = useActionState(
    loginAction(
      setError,
      setNotification,
      setEmail,
      setOtpEmailSend,
      setTimerStatus
    ),
    initialStatus
  );

  const onChangeValidation = useCallback(
    loginAndSignupFormFieldsValidation(formStatus, error, setError),
    [formStatus.formSubmittedCount, error]
  );

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (formStatus.success) {
      //set timer for 1min
      timer = setTimeout(() => {
        setError({
          email: [`User failed to verify 👉🏻 ${formStatus.data?.email} `],
        });
        setTimerStatus(false);
        setOtpEmailSend(false);
      }, 60000);
    }

    return () => clearTimeout(timer);
  }, [formStatus.formSubmittedCount, formStatus.success]);

  useEffect(() => {
    if (formStatus?.success) {
      //clear form inputs (useActionState reset form inputs by default)
      // clear errors
      setError(undefined);
    }
  }, [formStatus?.success]);

  return (
    <div className="card">
      <h1>
        <Trans>User Login</Trans>
      </h1>
      {isPending ? (
        <SkeForm />
      ) : (
        <form
          className="form"
          action={formAction}
          onChange={onChangeValidation}
        >
          <label htmlFor="email">
            <Trans>Enter email address</Trans>
            {timerStatus ? <Timer /> : ""}
            {error?.email && (
              <span className="error" id="emailErr" aria-live="assertive">
                {error?.email[0]}
              </span>
            )}
          </label>
          <EmailInput
            data={formStatus.data?.email || ""}
            error={error?.email ? true : false}
            autofocus={true}
            disabled={isOtpEmailSend}
          />
          <label htmlFor="password">
            <Trans>Enter password</Trans>
            {error?.password && (
              <span className="error" id="passwordErr" aria-live="assertive">
                {error?.password[0]}
              </span>
            )}
          </label>
          <PasswordInput
            fieldName="password"
            data={formStatus.data?.password || ""}
            error={error?.password ? true : false}
            disabled={isOtpEmailSend}
          />
          <button
            type="submit"
            disabled={error !== undefined || isOtpEmailSend}
          >
            <Trans>Login</Trans>
          </button>
        </form>
      )}
      <LoginBottomLinks />
      {isOtpEmailSend && <SendOTPForm next="user login" />}
      {/* <GoogleBtn /> */}
    </div>
  );
}

export default LoginPage;
