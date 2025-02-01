import React, { PropsWithChildren, useEffect, useState } from "react";
import AuthContext from "./CreateAuthContext";
import getCookie from "../utilities/getCookie";
import { UserType } from "../types/userType";
import { authenticationKey, localStorageName } from "../env";

// using three states of auth variable true, false, and null.
// null state = on page load it is null by deafult, then render spinner
//              behind the scene check auth cookie, if not present then set auth false
// false state = auth cookie is not present in browser
// true state = auth cookie is present in browser

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserType>({});

  //this effect only happens on initial page load
  useEffect(() => {
    // check client has auth cookie
    const authKey = getCookie(authenticationKey);

    // key is not present then set false else true
    //@ts-ignore
    typeof authKey === "object" && !authKey?.success
      ? setAuth(false)
      : setAuth(true);

    // TODO decrypt cookie, if not valid then set false

    // TODO get local storage data and validate
    const storageString = localStorage.getItem(localStorageName) || "";
    const userObject: UserType = storageString && JSON.parse(storageString);

    typeof userObject === "object" ? setUser(userObject) : setAuth(false);
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
