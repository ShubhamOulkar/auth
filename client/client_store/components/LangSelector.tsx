import React from "react";
import { loadCatalog } from "../../i18n";
import { Trans } from "@lingui/react/macro";
import useLangContext from "../lang context/useLangContext";
export function LangSelector() {
  const { lang, setLang } = useLangContext();
  const changeLang = (e: { target: { value: string } }) => {
    const langCode = e.target.value;
    loadCatalog(langCode);
    localStorage.setItem("auth-ssr-lang", langCode);
    setLang(langCode);
  };
  return (
    <div className="lang-container" aria-label="language selector">
      <select onChange={changeLang} className="lang-selector" value={lang}>
        <option key="English" value="en">
          &#x1F1FA;&#x1F1F8;<Trans> English</Trans>
        </option>
        <option key="French" value="fr">
          &#x1F1EB;&#x1F1F7;<Trans> French</Trans>
        </option>
        <option key="Hindi" value="hi">
          &#x1F1EE;&#x1F1F3;<Trans> Hindi</Trans>
        </option>
        <option key="Japanese" value="ja">
          &#x1f1ef;&#x1f1f5;<Trans>Japanese</Trans>
        </option>
        <option key="Korean" value="ko">
          &#x1F1F0;&#x1F1F7;<Trans> Korean</Trans>
        </option>
        <option key="Marathi" value="mr">
          &#x1F1EE;&#x1F1F3;<Trans> Marathi</Trans>
        </option>
      </select>
    </div>
  );
}
