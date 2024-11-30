import { createContext } from "react";
import { AuthContextType } from "../types/authContextType";

const AuthContext = createContext({} as AuthContextType);

export default AuthContext;
