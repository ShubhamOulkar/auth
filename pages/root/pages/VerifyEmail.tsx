import React from "react";
import { InvalidReq } from "../pages/PagesExporter";
import {
  Notification,
  EmailForm,
  SendOTPForm,
  CancelAuthenticationButton,
} from "../components/ComponentExpoter";
import { use2FaContext } from "../context/customUseContextExporters";

function VerifyEmail() {
  const { fa } = use2FaContext();

  if (!fa) {
    return <InvalidReq />;
  }

  return (
    <div className="card fa">
      <h1>Verify email </h1>
      <Notification />
      <EmailForm />
      <SendOTPForm />
      <CancelAuthenticationButton buttonName="Cancle Two factor Authentication" />
    </div>
  );
}

export default VerifyEmail;
