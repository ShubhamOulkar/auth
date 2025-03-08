import React, { useActionState, useEffect, useState, useCallback } from "react";
import {
  FirstNameInput,
  LastNameInput,
  EmailInput,
  PasswordInput,
  SkeForm,
} from "../components/ComponentExpoter";
import { useNotificationContext } from "../context/customUseContextExporters";
import { InitialStatus } from "../types/FormInitialStatus";
import { FieldErrors } from "../types/FormFieldErrors";
import signupAction from "../form actions/signupAction";
import loginAndSignupFormFieldsValidation from "../field validation handlers/loginAndSignupFormFieldsValidation";
import { Trans } from "@lingui/react/macro";
export const emptyFields = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialStatus: InitialStatus = {
  success: false,
  data: emptyFields,
  formSubmittedCount: 0,
};

function SignupPage() {
  const { setNotification } = useNotificationContext();
  const [errors, setErrors] = useState<FieldErrors>(undefined);
  const [formStatus, formAction, isPending] = useActionState(
    signupAction(setErrors, setNotification),
    initialStatus,
    "/login"
  );

  const onChangeValidation = useCallback(
    loginAndSignupFormFieldsValidation(formStatus, errors, setErrors),
    [formStatus.formSubmittedCount, errors]
  );

  useEffect(() => {
    if (formStatus?.success) {
      // reset form inputs (useActionState reset form inputs)
      // reset errors
      setErrors(undefined);
    }
  }, [formStatus?.success]);

  if (isPending) {
    return <SkeForm />;
  }

  return (
    <div className="card">
      <h1>
        <Trans>User Signup</Trans>
      </h1>
      <form className="form" action={formAction} onChange={onChangeValidation}>
        <label htmlFor="firstName">
          <Trans>Enter first name</Trans>
          {errors?.firstName && (
            <span className="error" id="firstNameErr" aria-live="assertive">
              {errors?.firstName[0]}
            </span>
          )}
        </label>
        <FirstNameInput
          data={formStatus.data?.firstName || ""}
          error={errors?.firstName ? true : false}
          autofocus={true}
        />
        <label htmlFor="lastName">
          <Trans>Enter last name </Trans>
          {errors?.lastName && (
            <span className="error" id="lastNameErr" aria-live="assertive">
              {errors?.lastName[0]}
            </span>
          )}
        </label>
        <LastNameInput
          data={formStatus.data?.lastName || ""}
          error={errors?.lastName ? true : false}
        />
        <label htmlFor="email">
          <Trans>Enter email address</Trans>
          {errors?.email && (
            <span className="error" id="emailErr" aria-live="assertive">
              {errors?.email[0]}
            </span>
          )}
        </label>
        <EmailInput
          data={formStatus.data?.email || ""}
          error={errors?.email ? true : false}
        />
        <label htmlFor="password">
          <Trans>Enter password</Trans>
          {errors?.password && (
            <span className="error" id="passwordErr" aria-live="assertive">
              {errors?.password[0]}
            </span>
          )}
        </label>
        <PasswordInput
          fieldName="password"
          error={errors?.password ? true : false}
          data={formStatus.data?.password || ""}
        />
        <label htmlFor="confirmPassword">
          <Trans>Enter password to confirm</Trans>
          {errors?.confirmPassword && (
            <span
              className="error"
              id="confirmPasswordErr"
              aria-live="assertive"
            >
              {errors?.confirmPassword[0]}
            </span>
          )}
        </label>
        <PasswordInput
          fieldName="confirmPassword"
          error={errors?.confirmPassword ? true : false}
          data={formStatus.data?.confirmPassword || ""}
        />
        <button type="submit" disabled={errors !== undefined}>
          <Trans>Create account</Trans>
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
