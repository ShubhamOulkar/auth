import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import LoginFormSchema from "../validation/loginFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputs } from "../types/formFieldsTypes";
import Label from "../components/FieldLabel";
import GoogleBtn from "../components/GoogleBtn";
import loginFormHandler from "../handlers/loginFormHandler";
import useAuthContext from "../auth context/useAuthContext";
import Spinner from "../components/Spinner";
import useNotificationContext from "../notification context/useNotificationContexxt";
import { loginFormHandlerType } from "../types/LoginFormHandlerType";
import { storeInLocalStorage } from "../utilities/storeInLocalStorage";

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthContext();
  const { setNotification } = useNotificationContext();

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

    // set auth false if authorization faild
    //@ts-ignore
    response?.success ? setAuth(true) : setAuth(false);

    // store user auth data in localstorage
    //@ts-ignore
    storeInLocalStorage(response.user);

    //set notification for client (show errors as well as success)
    setNotification(response);

    //navigate to redirect route provided by server
    //@ts-ignore
    response?.success && navigate(response?.redirect);
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
      <GoogleBtn />
    </div>
  );
}

export default LoginPage;
