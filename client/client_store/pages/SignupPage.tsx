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

/**
 * A logout form page component.
 *
 * @returns {JSX.Element} A page containing logout form
 */

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
      <h1>User Signup</h1>
      <form className="form" action={formAction} onChange={onChangeValidation}>
        <FirstNameInput
          data={formStatus.data?.firstName || ""}
          error={errors?.firstName ? errors?.firstName[0] : ""}
          autofocus={true}
        />
        <LastNameInput
          data={formStatus.data?.lastName || ""}
          error={errors?.lastName ? errors?.lastName[0] : ""}
        />
        <EmailInput
          data={formStatus.data?.email || ""}
          error={errors?.email ? errors.email[0] : ""}
        />
        <PasswordInput
          fieldName="password"
          error={errors?.password ? errors.password[0] : ""}
          data={formStatus.data?.password || ""}
        />
        <PasswordInput
          fieldName="confirmPassword"
          error={errors?.confirmPassword ? errors.confirmPassword[0] : ""}
          data={formStatus.data?.confirmPassword || ""}
        />
        <button type="submit" disabled={errors !== undefined}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
