import { useContext } from "react";
import LangContext from "./CreateLangContext";
const useLangContext = () => {
  const context = useContext(LangContext);

  if (!context)
    throw new Error("usuLangContext must be used within a LangProvider");

  return context;
};

export default useLangContext;
