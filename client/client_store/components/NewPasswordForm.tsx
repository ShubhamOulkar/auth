import React, { useActionState, useState, useCallback } from "react";
import { PasswordInput } from "../components/ComponentExpoter";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import { InitialStatus } from "../types/FormInitialStatus";
import { FieldErrors } from "../types/FormFieldErrors";
import resetPasswordFormFieldsValidation from "../field validation handlers/resetPasswordFormFieldsValidation";
import resetPasswordAction from "../form actions/resetPasswordAction";
import SkeForm from "./skeleton/SkeForm";
import { Trans } from "@lingui/react/macro";
function NewPasswordForm() {
  const { setNotification } = useNotificationContext();
  const { email, reset2FaContext } = use2FaContext();
  const [error, setError] = useState<FieldErrors>();
  const initialStatus: InitialStatus = {
    success: true,
    data: {
      password: "",
      confirmPassword: "",
    },
  };
  const [formStatus, formAction, isPending] = useActionState(
    resetPasswordAction(email, setError, setNotification, reset2FaContext),
    initialStatus
  );

  const onChangeValidation = useCallback(
    resetPasswordFormFieldsValidation(setError),
    [formStatus.success, error]
  );

  if (isPending) {
    return <SkeForm />;
  }

  return (
    <>
      <p>User {email} setting new password</p>
      <form className="form" action={formAction} onChange={onChangeValidation}>
        <label htmlFor="password">
          <Trans>Enter password </Trans>
          {error?.password && (
            <span className="error" id="passwordErr" aria-live="assertive">
              {error?.password[0]}
            </span>
          )}
        </label>
        <PasswordInput
          fieldName="password"
          error={error?.password ? true : false}
          data={formStatus.data?.password || ""}
        />
        <label htmlFor="confirmPassword">
          <Trans>Enter password to confirm</Trans>
          {error?.confirmPassword && (
            <span
              className="error"
              id="confirmPasswordErr"
              aria-live="assertive"
            >
              {error?.confirmPassword[0]}
            </span>
          )}
        </label>
        <PasswordInput
          fieldName="confirmPassword"
          error={error?.confirmPassword ? true : false}
          data={formStatus.data?.confirmPassword || ""}
        />
        <button type="submit" disabled={error !== undefined}>
          <Trans>Set new password</Trans>
        </button>
      </form>
    </>
  );
}

export default NewPasswordForm;
