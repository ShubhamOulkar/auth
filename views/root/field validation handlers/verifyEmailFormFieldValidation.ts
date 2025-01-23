import { EmailSchema } from "../validation/loginFormSchema";
import { FieldErrors } from "../types/FormFieldErrors";

export default function verifyEmailFormFieldValidation(
  twoFaContext: string,
  setError: React.Dispatch<React.SetStateAction<FieldErrors>>
) {
  return (e: React.ChangeEvent<HTMLFormElement>) => {
    e.stopPropagation(); // stop event bubbling to parent

    // only check email if user is using forgot password
    if (twoFaContext === "forgot password") {
      const fieldName = e.target?.name;
      const value = e.target?.value;
      const validate = EmailSchema.safeParse({ [fieldName]: value });
      if (!validate.success) {
        setError(validate.error.flatten().fieldErrors);
        return;
      }
      // set error undefined on validation success
      setError(undefined);
    }
  };
}
