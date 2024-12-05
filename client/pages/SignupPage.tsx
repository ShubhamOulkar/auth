import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import SignupFormSchema from "../validation/signupFormSchema";
import { SignupInputs } from "../types/formFieldsTypes";
import { Label } from "../components/ComponentExpoter";
import signupFormHandler from "../handlers/signupFormHandler";
import { useNotificationContext } from "../context/customUseContextExporters";
import { SignupFormHandlerType } from "../types/SignupFormHandlerType";

function SignupPage() {
  const navigate = useNavigate();
  const { setNotification } = useNotificationContext();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SignupInputs>({
    resolver: zodResolver(SignupFormSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [formState, reset]);

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    let response: SignupFormHandlerType = await signupFormHandler(data);

    console.log("signup response: ", response);

    // generate notification (show errors as well as success message)
    setNotification(response);

    //@ts-ignore
    response?.success && navigate(response?.redirect);
  };

  return (
    <div className="card">
      <h1>User Signup</h1>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <Label
          label="User first name"
          labelFor="firstName"
          errorsObj={errors}
        />

        <input
          id="firstname"
          type="text"
          className={errors?.firstName && "invalid"}
          autoFocus={true}
          aria-describedby="firstNameErr"
          {...register("firstName")}
        />

        <Label label="User last name" labelFor="lastName" errorsObj={errors} />

        <input
          id="lastname"
          type="text"
          className={errors?.lastName && "invalid"}
          aria-describedby="lastNameErr"
          {...register("lastName")}
        />
        <Label label="User email address" labelFor="email" errorsObj={errors} />

        <input
          id="email"
          type="email"
          className={errors?.email && "invalid"}
          placeholder="abcd@xyz.com"
          aria-describedby="emailErr"
          {...register("email")}
        />

        <Label label="Create password" labelFor="password" errorsObj={errors} />

        <input
          id="password"
          type="password"
          className={errors?.password && "invalid"}
          aria-describedby="passwordErr"
          {...register("password")}
        />
        <Label
          label="Confirm password"
          labelFor="confirmPassword"
          errorsObj={errors}
        />

        <input
          id="confirmPassword"
          type="password"
          className={errors?.confirmPassword && "invalid"}
          aria-describedby="confirmErr"
          {...register("confirmPassword")}
        />

        <button type="submit" disabled={Object.keys(errors).length !== 0}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
