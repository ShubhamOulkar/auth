import React from "react";
import { loadCatalog } from "../../i18n";
import { Trans } from "@lingui/react/macro";

const lang = {
  English: "en",
  French: "fr",
  Hindi: "hi",
  Japanese: "ja",
  Korean: "ko",
  Marathi: "mr",
};

export function LocalSwitcher() {
  return (
    <div className="lang-switcher-container">
      <button>
        <Trans>Language</Trans>
      </button>
      <ul>
        {Object.keys(lang).map((key) => (
          <li onClick={() => loadCatalog(lang[key])} key={key}>
            {key}
          </li>
        ))}
      </ul>
    </div>
  );
}
