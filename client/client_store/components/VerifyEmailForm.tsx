import React, { useActionState, useCallback, useState, useEffect } from "react";
import { EmailInput, Timer } from "../components/ComponentExpoter";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import verifyEmailFormFieldValidation from "../field validation handlers/verifyEmailFormFieldValidation";
import { InitialStatus } from "../types/FormInitialStatus";
import { FieldErrors } from "../types/FormFieldErrors";
import verifyEmailAction from "../form actions/verifyEmailAction";
import { Trans } from "@lingui/react/macro";

function EmailForm() {
  const { setNotification } = useNotificationContext();
  const { setEmail, setOtpEmailSend, timerStatus, setTimerStatus } =
    use2FaContext();
  const [error, setError] = useState<FieldErrors>();
  const initialStatus: InitialStatus = {
    success: false,
    data: { email: "" },
    formSubmittedCount: 0,
  };
  const [formStatus, formAction, isPending] = useActionState(
    verifyEmailAction(setError, setNotification, setEmail, setOtpEmailSend),
    initialStatus
  );

  const onChangeValidation = useCallback(
    verifyEmailFormFieldValidation(setError),
    [formStatus.success, error]
  );

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (formStatus.success) {
      setTimerStatus(true);
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

  return (
    <>
      <form className="form" action={formAction} onChange={onChangeValidation}>
        <label htmlFor="email">
          <Trans>Enter email address </Trans>
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
          disabled={timerStatus}
        />
        <button
          type="submit"
          disabled={error !== undefined || (formStatus.success && timerStatus)}
        >
          {isPending ? (
            <Trans>Sending code...</Trans>
          ) : (
            <Trans>Send verification code</Trans>
          )}
        </button>
      </form>
      <p className="card-link">
        {timerStatus ? (
          <Trans>
            `A verification code has been send to ${formStatus.data?.email}.`
          </Trans>
        ) : (
          <Trans>
            Verification code is not send. Click on send verification code.
          </Trans>
        )}
      </p>
    </>
  );
}

export default EmailForm;
