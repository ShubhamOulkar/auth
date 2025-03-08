import { useEffect } from "react";
import { useNavigate } from "react-router";
import { EmailForm, SendOTPForm } from "../components/ComponentExpoter";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { loadCatalog } from "../../i18n";
import useLangContext from "../lang context/useLangContext";
import { Trans } from "@lingui/react/macro";

function VerifyEmail() {
  const navigate = useNavigate();
  const { lang } = useLangContext();
  useEffect(() => {
    loadCatalog(lang);
  }, [lang]);
  return (
    <I18nProvider i18n={i18n}>
      <div className="card fa">
        <h1>
          <Trans>Verify email</Trans>
        </h1>
        <EmailForm />
        <SendOTPForm redirectRoute={navigate} next="reset password" />
        <a className="card-link" href="/login">
          <Trans>Cancel Email Verification</Trans>
        </a>
      </div>
    </I18nProvider>
  );
}

export default VerifyEmail;
