import React, { useEffect, useActionState, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleBtn,
  Spinner,
  LoginBottomLinks,
  EmailInput,
  PasswordInput,
} from "../components/ComponentExpoter";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import loginAndSignupFormFieldsValidation from "../field validation handlers/loginAndSignupFormFieldsValidation";
import { InitialStatus } from "../types/FormInitialStatus";
import { FieldErrors } from "../types/FormFieldErrors";
import loginAction, { emptyFields } from "../form actions/loginAction";

/**
 * A login form page component.
 *
 * @returns {JSX.Element} A page containing login form
 */

const initialStatus: InitialStatus = {
  success: false,
  data: emptyFields,
  formSubmittedCount: 0,
};

function LoginPage() {
  const navigate = useNavigate();
  const { setNotification } = useNotificationContext();
  const { setFa, setEmail, setTwoFaContext } = use2FaContext();

  // react 19 hooks
  const [error, setError] = useState<FieldErrors>();
  const [formStatus, formAction, isPending] = useActionState(
    loginAction(
      setError,
      setNotification,
      setFa,
      setTwoFaContext,
      setEmail,
      navigate
    ),
    initialStatus
  );

  const onChangeValidation = useCallback(
    loginAndSignupFormFieldsValidation(formStatus, error, setError),
    [formStatus.formSubmittedCount, error]
  );

  useEffect(() => {
    if (formStatus?.success) {
      //clear form inputs (useActionState reset form inputs by default)
      // clear errors
      setError(undefined);
    }
  }, [formStatus?.success]);

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className="card">
      <h1>User Login</h1>
      <form className="form" action={formAction} onChange={onChangeValidation}>
        <EmailInput
          data={formStatus.data?.email || ""}
          error={error?.email ? error?.email[0] : ""}
          autofocus={true}
        />
        <PasswordInput
          fieldName="password"
          data={formStatus.data?.password || ""}
          error={error?.password ? error?.password[0] : ""}
        />
        <button type="submit" disabled={error !== undefined}>
          Login
        </button>
      </form>
      <LoginBottomLinks />
      {/* <GoogleBtn /> */}
    </div>
  );
}

export default LoginPage;
