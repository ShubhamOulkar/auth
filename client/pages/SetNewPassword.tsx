import React from "react";
import use2FaContext from "../2fa context/use2FaContext";
import { InvalidReq } from "../pages/PagesExporter";
import { Notification, NewPasswordForm } from "../components/ComponentExpoter";

function SetNewPassword() {
  const { fa, isEmailVerified } = use2FaContext();

  if (!fa || !isEmailVerified) {
    return <InvalidReq />;
  }

  return (
    <>
      <div className="card fa">
        <Notification />
        <h1>Set new password</h1>
        <NewPasswordForm />
      </div>
    </>
  );
}

export default SetNewPassword;
