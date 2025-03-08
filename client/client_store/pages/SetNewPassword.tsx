import { useEffect } from "react";
import NewPasswordForm from "../components/NewPasswordForm";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { loadCatalog } from "../../i18n";
import useLangContext from "../lang context/useLangContext";
import { Trans } from "@lingui/react/macro";

function SetNewPassword() {
  const { lang } = useLangContext();
  useEffect(() => {
    loadCatalog(lang);
  }, [lang]);
  return (
    <>
      <I18nProvider i18n={i18n}>
        <div className="card fa">
          <h1>
            <Trans>Set new password</Trans>
          </h1>
          <NewPasswordForm />
          <a className="card-link" href="/login">
            <Trans>Cancle Password reset</Trans>
          </a>
        </div>
      </I18nProvider>
    </>
  );
}

export default SetNewPassword;
