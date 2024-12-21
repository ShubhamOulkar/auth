import React, {
  useEffect,
  useRef,
  useActionState,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  EmailSchema,
  PasswordSchema,
  LoginFormSchema,
} from "../validation/loginFormSchema";
import {
  GoogleBtn,
  Spinner,
  LoginBottomLinks,
  EmailInput,
  PasswordInput,
} from "../components/ComponentExpoter";
import loginFormHandler from "../handlers/loginFormHandler";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import { loginFormHandlerType } from "../types/LoginFormHandlerType";

/**
 * A login form page component.
 *
 * @returns {JSX.Element} A page containing login form
 */
// form field errors
type FieldErrors = {
  email?: string[] | undefined;
  password?: string[] | undefined;
};

// form initial status
type InitialStatus = {
  success: boolean;
  data?: { email: string; password: string };
};

const initialStatus: InitialStatus = {
  success: false,
  data: { email: "", password: "" }, //initial form fields are empty
};

function LoginPage() {
  const navigate = useNavigate();
  const { setNotification } = useNotificationContext();
  const { setFa, setEmail, setTwoFaContext } = use2FaContext();
  const formRef = useRef<HTMLFormElement | null>(null);

  // react 19 hooks
  const [submittedCount, setSubmittedCount] = useState(0);
  const [error, setError] = useState<FieldErrors>();
  const [formStatus, formAction, isPending] = useActionState(
    async (previousState, formData: FormData) => {
      // set form submission count
      setSubmittedCount((count) => (count += 1));
      console.log("login formData: ", formData);
      const data = {
        email: formData.get("email")?.toString() || "",
        password: formData.get("password")?.toString() || "",
      };

      // validate form data
      const validation = LoginFormSchema.safeParse(data);
      if (!validation.success) {
        const { fieldErrors } = validation.error.flatten();
        setError(fieldErrors);
        // on form invalid
        const returnFormFields: InitialStatus = {
          success: false,
          data: data, // this form data is used to fill form fields on failed validation
        };
        return returnFormFields;
      }

      const response: loginFormHandlerType = await loginFormHandler(
        validation.data
      );
      console.log("login endpoint response: ", response);
      //set notification for client (show errors as well as success)
      setNotification(response);

      if (response.success) {
        // set two factor context
        setTwoFaContext("verify email");
        // enable two factor auth
        setFa(true);
        // set email context
        setEmail(validation.data.email);
        //navigate to redirect route provided by server
        //@ts-ignore
        response?.success && navigate(response?.redirect);
        // return form status true i.e. sumitted successfully
        return {
          success: true,
        } as InitialStatus;
      }

      return {
        success: false,
      } as InitialStatus;
    },
    initialStatus
  );

  const onChangeValidation = useCallback(
    (e: React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation(); // stop event bubbling to parent
      if (submittedCount > 0) {
        // only validate after submission
        const fieldName = e.target?.name;
        const value = e.target?.value;
        const validate =
          fieldName === "password"
            ? PasswordSchema.safeParse({ [fieldName]: value })
            : EmailSchema.safeParse({ [fieldName]: value });

        if (validate.success) {
          setError((prev) => ({ ...prev, [fieldName]: undefined }));
          e.stopPropagation();
          return;
        }
        const err = validate.error?.flatten().fieldErrors;
        setError((prev) => ({ ...prev, ...err }));
      }
    },
    [submittedCount, error]
  );

  useEffect(() => {
    if (formStatus?.success) {
      //clear form inputs (useActionState reset form inputs by default)
      formRef.current?.reset();
      // clear errors
      setError({ email: undefined, password: undefined });
    }
  }, [formStatus?.success]);

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className="card">
      <h1>User Login</h1>
      <form
        className="form"
        action={formAction}
        onChange={onChangeValidation}
        ref={formRef}
      >
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

        <button
          type="submit"
          disabled={
            (error?.email && error?.email.length !== 0) ||
            (error?.password && error?.password.length !== 0)
          }
        >
          Login
        </button>
      </form>
      <LoginBottomLinks />
      <GoogleBtn />
    </div>
  );
}

export default LoginPage;
