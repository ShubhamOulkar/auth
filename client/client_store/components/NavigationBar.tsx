import { VscThreeBars } from "react-icons/vsc";
import { PiUserCircleGearBold } from "react-icons/pi";
import React, { useRef, useState, useEffect } from "react";
import { UserType } from "../types/userType";
import { CLientErrorType } from "../types/notificationType";
import { getLocalStorageData } from "../utilities/getLocalStorageData";
import getCookie from "../utilities/getCookie";
import MotherBtn from "./MotherBtn";
const authKeyName = import.meta.env.VITE_AUTH_KEY;

export default function NavBar() {
  const togglerBtn = useRef<HTMLLIElement>(null);
  const [auth, setAuth] = useState<boolean | undefined>();
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
  }, []);

  function toggleFunction() {
    if (togglerBtn) {
      togglerBtn.current?.closest("nav")?.classList.toggle("responsive");
    }
  }

  return (
    <nav className="topnav" id="myTopnav">
      <ul className="uList">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          {auth === true ? (
            <a href="/profile">
              {user?.picture ? (
                <img
                  className="navprofile"
                  src={user?.picture}
                  alt={`${user?.email} picture`}
                />
              ) : (
                <PiUserCircleGearBold width={100} height={100} />
              )}
              {user?.first}
            </a>
          ) : (
            <a href="/login">Login</a>
          )}
          {auth === undefined && <a id="ske-btn"></a>}
        </li>
        <li>
          {auth === true ? (
            <MotherBtn btnName="Logout" />
          ) : (
            <a href="/signup">Signup</a>
          )}
          {auth === undefined && <a id="ske-btn"></a>}
        </li>
        <li ref={togglerBtn} onClick={toggleFunction}>
          <a className="icon">
            <VscThreeBars />
          </a>
        </li>
      </ul>
    </nav>
  );
}
