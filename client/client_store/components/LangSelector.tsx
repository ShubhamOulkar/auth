import { loadCatalog } from "../../i18n";
import { Trans } from "@lingui/react/macro";
import useLangContext from "../lang context/useLangContext";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
export function LangSelector() {
  const { lang, setLang } = useLangContext();
  const changeLang = (e: { target: { value: string } }) => {
    const langCode = e.target.value;
    loadCatalog(langCode);
    localStorage.setItem("auth-ssr-lang", langCode);
    setLang(langCode);
  };
  return (
    <div className="lang-container">
      <select onChange={changeLang} className="lang-selector" value={lang}>
        <option key="English" value="en">
          {getUnicodeFlagIcon("US")}
          <Trans> English</Trans>
        </option>
        <option key="French" value="fr">
          {getUnicodeFlagIcon("FR")}
          <Trans> French</Trans>
        </option>
        <option key="Hindi" value="hi">
          {getUnicodeFlagIcon("IN")}
          <Trans> Hindi</Trans>
        </option>
        <option key="Japanese" value="ja">
          {getUnicodeFlagIcon("JP")}
          <Trans> Japanese</Trans>
        </option>
        <option key="Korean" value="ko">
          {getUnicodeFlagIcon("KR")}
          <Trans> Korean</Trans>
        </option>
        <option key="Marathi" value="mr">
          {getUnicodeFlagIcon("IN")}
          <Trans> Marathi</Trans>
        </option>
      </select>
    </div>
  );
}
