import React, { PropsWithChildren, useEffect, useState } from "react";
import AuthContext from "./CreateAuthContext";
import getCookie from "../utilities/getCookie";
import { UserType } from "../types/userType";
import { CLientErrorType } from "../types/notificationType";
import { getLocalStorageData } from "../utilities/getLocalStorageData";
const authKeyName = import.meta.env.VITE_AUTH_KEY;

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    let valid = false;
    const authKey: string | CLientErrorType = getCookie(authKeyName);
    //check authKey is not error object
    if (typeof authKey === "string") {
      // TODO validate auth key
      valid = true;
    } else {
      setAuth(false);
    }

    // if auth key is valid
    if (valid) {
      const user = getLocalStorageData();
      setUser(user);
      setAuth(true);
    }
  }, [auth]);

  return (
    <>
      <AuthContext.Provider
        value={{
          auth,
          setAuth,
          user,
          setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
