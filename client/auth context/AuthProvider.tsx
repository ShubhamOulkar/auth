import React, { PropsWithChildren, useEffect, useState } from "react";
import AuthContext from "./CreateAuthContext";
import getCookie from "../utilities/getCookie";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState<boolean | null>(null);

  //this effect only happens on initial page load
  useEffect(() => {
    // check client has auth cookie
    const authKey = getCookie("key");
    console.log("auth key: ", authKey);
    // key is not present then set false
    //@ts-ignore
    typeof authKey === "object" && !authKey?.success
      ? setAuth(false)
      : setAuth(true);

    //TODO decrypt cookie, if not valid then set false
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
