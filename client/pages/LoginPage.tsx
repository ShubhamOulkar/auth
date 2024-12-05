import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import LoginFormSchema from "../validation/loginFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputs } from "../types/formFieldsTypes";
import {
  Label,
  GoogleBtn,
  Spinner,
  LoginBottomLinks,
} from "../components/ComponentExpoter";
import loginFormHandler from "../handlers/loginFormHandler";
import {
  useAuthContext,
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import { loginFormHandlerType } from "../types/LoginFormHandlerType";

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();
  const { setNotification } = useNotificationContext();
  const { setFa, setEmail, setTwoFaContext } = use2FaContext();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<LoginInputs>({
    // defaultValues: { email: "abcd@gmail.com" }, // default values for input fields(i am using autofill)
    resolver: zodResolver(LoginFormSchema),
  });

  // clear the input fields
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ email: "", password: "" });
    }
  }, [formState, reset]);

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    const response: loginFormHandlerType = await loginFormHandler(data);

    console.log("login response: ", response);

    //set notification for client (show errors as well as success)
    setNotification(response);

    if (response.success) {
      // set two factor context
      setTwoFaContext("verify email");
      // enable two factor auth
      setFa(true);
      // set email conatext
      setEmail(data.email);
      //navigate to redirect route provided by server
      //@ts-ignore
      response?.success && navigate(response?.redirect);
    }
  };

  if (isSubmitting) {
    return <Spinner />;
  }

  return (
    <div className="card">
      <h1>User Login</h1>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <Label
          label="Enter email address"
          labelFor="email"
          errorsObj={errors}
        />
        <input
          id="email"
          type="email"
          className={errors?.email && "invalid"}
          autoComplete="email webauthn"
          autoFocus={true}
          aria-describedby="emailErr"
          {...register("email")}
        />

        <Label label="Enter password" labelFor="password" errorsObj={errors} />
        <input
          id="password"
          type="password"
          className={errors?.password && "invalid"}
          autoComplete="current-password webauthn"
          aria-describedby="passwordErr"
          {...register("password")}
        />

        <button type="submit" disabled={Object.keys(errors).length !== 0}>
          Login
        </button>
      </form>
      <LoginBottomLinks />
      <GoogleBtn />
    </div>
  );
}

export default LoginPage;
