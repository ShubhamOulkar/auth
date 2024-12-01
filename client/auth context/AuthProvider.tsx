import React, { PropsWithChildren, useEffect, useState } from "react";
import AuthContext from "./CreateAuthContext";
import getCookie from "../utilities/getCookie";

// using three states of auth variable true, false, and null.
// null state = on page load it is null by deafult, then render spinner
//              behind the scene check auth cookie, if not present then set auth false
// false state = auth cookie is not present in browser
// true state = auth cookie is present in browser

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<boolean | null>(null);

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
  }, [auth]);

  return (
    <>
      <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
