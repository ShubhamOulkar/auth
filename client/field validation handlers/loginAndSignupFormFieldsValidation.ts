import {
  PasswordSchema,
  ConfirmPasswordSchema,
  FirstNameSchema,
  LastNameSchema,
} from "../validation/signupFormSchema";
import { EmailSchema } from "../validation/loginFormSchema";
import { InitialStatus } from "../types/FormInitialStatus";
import { FieldErrors } from "../types/FormFieldErrors";

export default function loginAndSignupFormFieldsValidation(
  formStatus: InitialStatus,
  errors: FieldErrors,
  setErrors: React.Dispatch<React.SetStateAction<FieldErrors>>
) {
  return async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.stopPropagation();
    if (formStatus.formSubmittedCount && formStatus.formSubmittedCount > 0) {
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
        // 1st update current field validation error to undefined
        const newErrors = { ...errors, [fieldName]: undefined };
        const nextError =
          // check if all fields errors are undefined
          !Object.values(newErrors).join("")
            ? undefined // if all fields are undefined then return undefined
            : newErrors; // if not all undefined then return new error as nextError

        setErrors(nextError);
        return;
      }
      const err = validate.error?.flatten().fieldErrors;
      setErrors((prev) => ({ ...prev, ...err }));
    }
  };
}
