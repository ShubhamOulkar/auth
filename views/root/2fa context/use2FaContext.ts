import { useContext } from "react";
import faContext from "./create2faContext";

const use2FaContext = () => {
  const context = useContext(faContext);

  if (!context) console.error("use2FaContext must be called in FaProvider");

  return context;
};

export default use2FaContext;
