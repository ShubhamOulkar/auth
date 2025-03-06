import { createContext } from "react";

const LangContext = createContext(
  {} as { lang: string; setLang: React.Dispatch<React.SetStateAction<string>> }
);

export default LangContext;
