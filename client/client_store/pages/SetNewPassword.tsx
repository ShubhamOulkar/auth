import {
  NewPasswordForm,
  CancelAuthenticationButton,
} from "../components/ComponentExpoter";

function SetNewPassword() {
  return (
    <>
      <div className="card fa">
        <h1>Set new password</h1>
        <NewPasswordForm />
        <CancelAuthenticationButton buttonName="Cancle Password reset" />
      </div>
    </>
  );
}

export default SetNewPassword;
