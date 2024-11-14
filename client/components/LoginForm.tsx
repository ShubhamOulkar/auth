import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function LoginForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="card">
      <h1>User Login</h1>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">
          Enter email address{" "}
          {errors.email && <span> * This field is required</span>}
        </label>
        <input
          id="email"
          type="email"
          placeholder="abcd@xyz.com"
          autoComplete="true"
          autoFocus={true}
          {...register("email", { required: true })}
        />

        <label htmlFor="password">
          Enter password
          {errors.password && <span> * This field is required</span>}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="true"
          {...register("password", { required: true })}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginForm;
