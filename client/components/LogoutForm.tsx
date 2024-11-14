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
      <h1>User Signup</h1>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="firstname">
          User first name{" "}
          {errors.firstname && <span> * This field is required</span>}
        </label>
        <input type="text" {...register("firstname", { required: true })} />

        <label htmlFor="lastname">
          User last name
          {errors.lastname && <span> * This field is required</span>}
        </label>
        <input type="text" {...register("lastname", { required: true })} />

        <label htmlFor="email">
          Email address{errors.email && <span> * This field is required</span>}
        </label>
        <input
          type="email"
          placeholder="abcd@xyz.com"
          {...register("email", { required: true })}
        />

        <label htmlFor="password">
          Create password
          {errors.password && <span> * This field is required</span>}
        </label>
        <input type="password" {...register("password", { required: true })} />

        <label htmlFor="confirmPassword">
          Confirm password
          {errors.confirmPassword && <span> * This field is required</span>}
        </label>
        <input
          type="password"
          {...register("confirmPassword", { required: true })}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginForm;
