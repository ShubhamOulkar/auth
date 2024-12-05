import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label, Spinner } from "../components/ComponentExpoter";
import { FaPasswordResetInputs } from "../types/FaType";
import { FaPasswordResetSchema } from "../validation/2FaSchema";
import {
  useNotificationContext,
  use2FaContext,
} from "../context/customUseContextExporters";
import newPasswordFormHandler from "../handlers/newPasswordFormHandler";

function NewPasswordForm() {
  const navigate = useNavigate();
  const { setNotification } = useNotificationContext();
  const { email, reset2FaContext, setFa } = use2FaContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FaPasswordResetInputs>({
    resolver: zodResolver(FaPasswordResetSchema),
  });

  const onSubmit: SubmitHandler<FaPasswordResetInputs> = async (data) => {
    // send data to endpoint
    const newData = { ...data, email };
    console.log("new password data:", newData);
    const response = await newPasswordFormHandler(newData);
    // on success response, enable code varification form
    setNotification(response);

    if (response.success) {
      reset2FaContext();
      setFa(false);
    }

    //@ts-ignore
    navigate(response.redirect);
  };

  if (isSubmitting) {
    return <Spinner />;
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <Label label="Create password" labelFor="password" errorsObj={errors} />

      <input
        id="password"
        type="password"
        className={errors?.password && "invalid"}
        aria-describedby="passwordErr"
        {...register("password")}
        autoFocus={true}
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
        Set new password
      </button>
    </form>
  );
}

export default NewPasswordForm;
