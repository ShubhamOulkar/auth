import { EmailSchema } from "../validation/loginFormSchema";
import { InitialStatus } from "../types/FormInitialStatus";
import verifyEmailFormHandler, {
  VerifyEmailFormHandlerType,
} from "../handlers/varifyEmailFormHandler";
import { FieldErrors } from "../types/FormFieldErrors";
import { NotificationType } from "../types/notificationType";
import { SetStateAction } from "react";

export default function verifyEmailAction(
  setError: React.Dispatch<React.SetStateAction<FieldErrors>>,
  setNotification: {
    (value: SetStateAction<NotificationType | undefined>): void;
    (arg0: VerifyEmailFormHandlerType): void;
  },
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setOtpEmailSend: React.Dispatch<React.SetStateAction<boolean>>
) {
  return async (previousState: InitialStatus, formData: FormData) => {
    const data = { email: formData.get("email")?.toString() || "" };
    // submit count
    const submitCount = (previousState.formSubmittedCount ?? 0) + 1;
    // validate email data
    const validate = EmailSchema.safeParse(data);
    if (!validate.success) {
      setError(validate.error.flatten().fieldErrors);
      return {
        success: false,
        data: data,
        formSubmittedCount: submitCount,
      } as InitialStatus;
    }

    const response = await verifyEmailFormHandler(validate.data);

    setNotification(response);

    if (response.success) {
      setEmail(validate.data.email);
      setOtpEmailSend(true);
      return {
        success: response.success,
        data: data,
        formSubmittedCount: submitCount,
      } as InitialStatus;
    }

    return {
      success: false,
      data: data,
      formSubmittedCount: submitCount,
    } as InitialStatus;
  };
}
