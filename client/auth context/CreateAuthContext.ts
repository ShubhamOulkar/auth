import { createContext } from "react";

type AuthContextType = {
  auth: boolean | null;
  setAuth: React.Dispatch<React.SetStateAction<boolean | null>>;
};

const AuthContext = createContext({} as AuthContextType);

export default AuthContext;
