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
    // validate email data
    const validate = EmailSchema.safeParse(data);
    if (!validate.success) {
      setError(validate.error.flatten().fieldErrors);
      return {
        success: false,
        data: data,
      } as InitialStatus;
    }

    const response = await verifyEmailFormHandler(validate.data);

    setNotification(response);

    if (response.success) {
      // set 2fa user email for reset password
      setEmail(validate.data.email);
      // set otp send to user email true
      setOtpEmailSend(true);
      return {
        success: true,
      } as InitialStatus;
    }

    setError({ email: [response.err_msg || ""] });
    return {
      success: false,
      data: data,
    } as InitialStatus;
  };
}
