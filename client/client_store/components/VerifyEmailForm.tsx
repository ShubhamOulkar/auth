import { useActionState, useCallback, useState, useEffect } from "react";
import { EmailInput } from "../components/ComponentExpoter";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import verifyEmailFormFieldValidation from "../field validation handlers/verifyEmailFormFieldValidation";
import { InitialStatus } from "../types/FormInitialStatus";
import { FieldErrors } from "../types/FormFieldErrors";
import verifyEmailAction from "../form actions/verifyEmailAction";

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
        <EmailInput
          data={formStatus.data?.email || ""}
          error={error?.email ? error.email[0] : ""}
          disabled={timerStatus}
        />
        <button
          type="submit"
          disabled={error !== undefined || (formStatus.success && timerStatus)}
        >
          {isPending ? "Sending code..." : "Send verification code"}
        </button>
      </form>
      <p className="card-link">
        {timerStatus
          ? `A verification code has been send to ${formStatus.data?.email}. `
          : "Verification code is not send. Click on send verification code."}
      </p>
    </>
  );
}

export default EmailForm;
