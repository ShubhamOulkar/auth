import {
  PasswordSchema,
  ConfirmPasswordSchema,
} from "../validation/signupFormSchema";
import { FieldErrors } from "../types/FormFieldErrors";

export default function (
  setError: React.Dispatch<React.SetStateAction<FieldErrors>>
) {
  return (e: React.ChangeEvent<HTMLFormElement>) => {
    e.stopPropagation(); // stop event bubbling to parent
    const fieldName = e.target?.name;
    const value = e.target?.value;
    const validate =
      fieldName === "password"
        ? PasswordSchema.safeParse({ [fieldName]: value })
        : ConfirmPasswordSchema.safeParse({ [fieldName]: value });
    if (!validate.success) {
      setError(validate.error.flatten().fieldErrors);
      return;
    }
    // set error undefined on validation success
    setError(undefined);
  };
}
