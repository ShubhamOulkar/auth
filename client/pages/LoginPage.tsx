import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import LoginFormSchema from "../validation/loginFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputs } from "../types/formFieldsTypes";
import Label from "../components/FieldLabel";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    defaultValues: { email: "abcd@gmail.com" }, // default values for input fields
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    console.log(data);
  };

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
          Submit
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
