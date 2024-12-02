import React, { PropsWithChildren, useEffect, useState } from "react";
import AuthContext from "./CreateAuthContext";
import getCookie from "../utilities/getCookie";
import { UserType } from "../types/userType";

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
    // TODO use env variable for key
    const authKey = getCookie("key");
    console.log("auth key: ", authKey);
    // key is not present then set false else true
    //@ts-ignore
    typeof authKey === "object" && !authKey?.success
      ? setAuth(false)
      : setAuth(true);

    // TODO decrypt cookie, if not valid then set false

    // TODO get local storage data and validate
    if (auth) {
      const storageString = localStorage.getItem(
        import.meta.env.VITE_LOCALSTORAGE_NAME
      );
      const userObject: UserType = storageString && JSON.parse(storageString);
      console.log("local storage:", storageString);
      typeof userObject === "object" ? setUser(userObject) : setUser({});
    }
  }, [auth]);

  return (
    <>
      <AuthContext.Provider value={{ auth, setAuth, user, setUser }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
