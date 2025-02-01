import { UserType } from "./userType";

export type AuthContextType = {
  auth: boolean | null;
  setAuth: React.Dispatch<React.SetStateAction<boolean | null>>;
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};
