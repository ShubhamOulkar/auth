import { Trans } from "@lingui/react/macro";
function LoginBottomLinks() {
  return (
    <div className="login-bottom-link">
      <a className="card-link" href="/forgotpassword">
        <Trans>Forgot password</Trans>
      </a>
      <a className="card-link" href="/signup">
        <Trans>Signup</Trans>
      </a>
    </div>
  );
}

export default LoginBottomLinks;
