import React, { PropsWithChildren, useState, useEffect } from "react";
import LangContext from "./CreateLangContext";
const LangProvider = ({ children }: PropsWithChildren) => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const langCode = localStorage.getItem("auth-ssr-lang");
    if (langCode) {
      setLang(langCode);
    }
  }, []);

  return (
    <>
      <LangContext.Provider value={{ lang, setLang }}>
        {children}
      </LangContext.Provider>
    </>
  );
};

export default LangProvider;
