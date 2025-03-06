import { loadCatalog } from "../../i18n";
import { Trans } from "@lingui/react/macro";
import useLangContext from "../lang context/useLangContext";

const locals = {
  English: "en",
  French: "fr",
  Hindi: "hi",
  Japanese: "ja",
  Korean: "ko",
  Marathi: "mr",
};

export function LangSelector() {
  const { lang } = useLangContext();
  const changeLang = (e: { target: { value: string } }) => {
    const langCode = e.target.value;
    loadCatalog(langCode);
    localStorage.setItem("auth-ssr-lang", langCode);
  };
  return (
    <div className="lang-container">
      <select onChange={changeLang} className="lang-selector">
        {Object.keys(locals).map((key) => (
          <option
            key={key}
            value={locals[key]}
            selected={locals[key] === lang ? true : false}
          >
            <Trans>{key}</Trans>
          </option>
        ))}
      </select>
    </div>
  );
}
