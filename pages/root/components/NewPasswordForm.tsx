import { useActionState, useState, useCallback } from "react";
import { useNavigate } from "react-router";
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

function NewPasswordForm() {
  const navigate = useNavigate();
  const { setNotification } = useNotificationContext();
  const { email, reset2FaContext, setFa } = use2FaContext();
  const [error, setError] = useState<FieldErrors>();
  const initialStatus: InitialStatus = {
    success: true,
    data: {
      password: "",
      confirmPassword: "",
    },
  };
  const [formStatus, formAction, isPending] = useActionState(
    resetPasswordAction(
      email,
      setError,
      setNotification,
      setFa,
      reset2FaContext,
      navigate
    ),
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
    <form className="form" action={formAction} onChange={onChangeValidation}>
      <PasswordInput
        fieldName="password"
        error={error?.password ? error.password[0] : ""}
        data={formStatus.data?.password || ""}
      />
      <PasswordInput
        fieldName="confirmPassword"
        error={error?.confirmPassword ? error.confirmPassword[0] : ""}
        data={formStatus.data?.confirmPassword || ""}
      />
      <button type="submit" disabled={error !== undefined}>
        Set new password
      </button>
    </form>
  );
}

export default NewPasswordForm;
