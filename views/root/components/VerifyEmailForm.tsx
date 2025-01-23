import { useActionState, useCallback, useState } from "react";
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
  const { email, setEmail, twoFaContext, setOtpEmailSend } = use2FaContext();
  const [error, setError] = useState<FieldErrors>();
  const initialStatus: InitialStatus = {
    success: false,
    data: { email: "" },
  };
  const [formStatus, formAction, isPending] = useActionState(
    verifyEmailAction(setError, setNotification, setEmail, setOtpEmailSend),
    initialStatus
  );

  const onChangeValidation = useCallback(
    verifyEmailFormFieldValidation(twoFaContext, setError),
    [formStatus.success, error]
  );

  return (
    <>
      <form className="form" action={formAction} onChange={onChangeValidation}>
        <EmailInput
          data={email || formStatus.data?.email || ""}
          error={error?.email ? error.email[0] : ""}
          readOnly={twoFaContext === "verify email"}
        />
        <button type="submit" disabled={error !== undefined}>
          {isPending ? "Sending code..." : "Send verification code"}
        </button>
      </form>
      <p className="card-link">
        {formStatus.success
          ? `A verification code has been send to ${email}. `
          : "Verification code is not send. Click on send verification code. "}
        Enter the code to continue and be redirected.
      </p>
    </>
  );
}

export default EmailForm;
