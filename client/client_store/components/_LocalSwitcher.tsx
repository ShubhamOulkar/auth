import React from "react";

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
      <button>Language</button>
      <ul>
        {Object.keys(lang).map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
    </div>
  );
}
