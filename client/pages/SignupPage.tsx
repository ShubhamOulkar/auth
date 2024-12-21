import React, { useActionState, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  PasswordSchema,
  ConfirmPasswordSchema,
  LastNameSchema,
  FirstNameSchema,
  SignupFormSchema,
} from "../validation/signupFormSchema";
import { EmailSchema } from "../validation/loginFormSchema";
import {
  FirstNameInput,
  LastNameInput,
  EmailInput,
  PasswordInput,
  Spinner,
} from "../components/ComponentExpoter";
import signupFormHandler from "../handlers/signupFormHandler";
import { useNotificationContext } from "../context/customUseContextExporters";
import { SignupFormHandlerType } from "../types/SignupFormHandlerType";

/**
 * A logout form page component.
 *
 * @returns {JSX.Element} A page containing logout form
 */

// form field errors
type FieldErrors = {
  firstName?: string[] | undefined;
  lastName?: string[] | undefined;
  email?: string[] | undefined;
  password?: string[] | undefined;
  confirmPassword?: string[] | undefined;
};

// form initial status
type InitialStatus = {
  success: boolean;
  data?: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
};

const initialStatus: InitialStatus = {
  success: false,
  data: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  }, //initial form fields are empty
};

function SignupPage() {
  const navigate = useNavigate();
  const { setNotification } = useNotificationContext();
  const [submittedCount, setSubmittedCount] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>();
  const [formStatus, formAction, isPending] = useActionState(
    async (previousState, formData: FormData) => {
      // set form submission count
      setSubmittedCount((count) => (count += 1));
      const data = {
        firstName: formData.get("firstName")?.toString() || "",
        lastName: formData.get("lastName")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        password: formData.get("password")?.toString() || "",
        confirmPassword: formData.get("confirmPassword")?.toString() || "",
      };

      // validate form data
      const validation = await SignupFormSchema.safeParseAsync(data);
      if (!validation.success) {
        const { fieldErrors } = validation.error.flatten();
        setErrors(fieldErrors);
        // on form invalid
        const returnFormFields: InitialStatus = {
          success: false,
          data: data, // this form data is used to fill form fields on failed validation
        };
        return returnFormFields;
      }

      let response: SignupFormHandlerType = await signupFormHandler(
        validation.data
      );

      console.log("signup response: ", response);

      // generate notification (show errors as well as success message)
      setNotification(response);

      //@ts-ignore
      response?.success && navigate(response?.redirect);

      return {
        success: true,
      } as InitialStatus;
    },
    initialStatus
  );

  const onChangeValidation = useCallback(
    async (e: React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation(); // stop event bubbling to parent
      if (submittedCount > 0) {
        // only validate after submission
        const fieldName = e.target?.name;
        const value = e.target?.value;
        let validate;

        switch (fieldName) {
          case "password":
            validate = await PasswordSchema.safeParseAsync({
              [fieldName]: value,
            });
            break;
          case "email":
            validate = await EmailSchema.safeParseAsync({ [fieldName]: value });
            break;
          case "confirmPassword":
            validate = await ConfirmPasswordSchema.safeParseAsync({
              [fieldName]: value,
            });
            break;
          case "firstName":
            validate = await FirstNameSchema.safeParseAsync({
              [fieldName]: value,
            });
            break;
          case "lastName":
            validate = await LastNameSchema.safeParseAsync({
              [fieldName]: value,
            });
            break;
        }

        if (validate.success) {
          setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
          e.stopPropagation();
          return;
        }
        const err = validate.error?.flatten().fieldErrors;
        setErrors((prev) => ({ ...prev, ...err }));
      }
    },
    [submittedCount, errors]
  );

  useEffect(() => {
    if (formStatus?.success) {
      // reset form inputs (useActionState reset form inputs)
      // reset errors
      setErrors({
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
      });
    }
  }, [formStatus?.success]);

  if (isPending) {
    return <Spinner />;
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SignupPage;
