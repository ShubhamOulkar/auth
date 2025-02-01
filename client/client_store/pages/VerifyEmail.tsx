import React from "react";
import { useNavigate } from "react-router";
import { EmailForm, SendOTPForm } from "../components/ComponentExpoter";

function VerifyEmail() {
  const navigate = useNavigate();
  return (
    <div className="card fa">
      <h1>Verify email </h1>
      <EmailForm />
      <SendOTPForm redirectRoute={navigate} next="reset password" />
      <a className="card-link" href="/login">
        Cancel Email Verification
      </a>
    </div>
  );
}

export default VerifyEmail;
