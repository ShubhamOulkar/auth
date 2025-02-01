import { ProfileCard, InvalidReq } from "../components/ComponentExpoter";
import React, { useEffect, useState } from "react";
import { getLocalStorageData } from "../utilities/getLocalStorageData";
import { UserType } from "../types/userType";
import { CLientErrorType } from "../types/notificationType";
import getCookie from "../utilities/getCookie";
const authKeyName = import.meta.env.VITE_AUTH_KEY;
function ProfilePage() {
  const [auth, setAuth] = useState<boolean | undefined>();
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    let valid = false;
    const authKey: string | CLientErrorType = getCookie(authKeyName);
    //check authKey is not error object
    if (typeof authKey === "string") {
      // TODO validate auth key
      valid = true;
      setAuth(false);
    } else {
      setAuth(false);
    }

    // if auth key is valid
    if (valid) {
      const user = getLocalStorageData();
      setUser(user);
      setAuth(true);
    }
  }, []);

  if (auth === false) {
    return <InvalidReq />;
  }
  return (
    <>
      {auth === undefined ? (
        <p>Loading user profile....</p>
      ) : (
        <ProfileCard user={user} />
      )}
    </>
  );
}

export default ProfilePage;
