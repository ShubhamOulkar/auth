import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignupFormSchema from "../validation/signupFormSchema";
import { SignupInputs } from "../types/formFieldsTypes";
import Label from "../components/FieldLabel";
import { object } from "zod";

function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInputs>({
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit: SubmitHandler<SignupInputs> = (data) => console.log(data);

  return (
    <div className="card">
      <h1>User Signup</h1>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <Label
          label="User first name"
          labelFor="firstname"
          errorsObj={errors}
        />
        <input
          id="firstname"
          type="text"
          className={errors?.firstname && "invalid"}
          autoFocus={true}
          aria-describedby="firstNameErr"
          {...register("firstname")}
        />
        <Label label="User last name" labelFor="lastname" errorsObj={errors} />
        <input
          id="lastname"
          type="text"
          className={errors?.lastname && "invalid"}
          aria-describedby="lastNameErr"
          {...register("lastname")}
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
