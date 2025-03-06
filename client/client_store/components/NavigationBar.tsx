import { VscThreeBars } from "react-icons/vsc";
import { PiUserCircleGearBold } from "react-icons/pi";
import { useState, useEffect } from "react";
import { UserType } from "../types/userType";
import { CLientErrorType } from "../types/notificationType";
import { getLocalStorageData } from "../utilities/getLocalStorageData";
import getCookie from "../utilities/getCookie";
import MotherBtn from "./MotherBtn";
import { LangSelector } from "./LangSelector";
import { Trans } from "@lingui/react/macro";
const authKeyName = import.meta.env.VITE_AUTH_KEY;

export default function NavBar() {
  const [mobileNav, setMobileNav] = useState(false);
  const [auth, setAuth] = useState<boolean | undefined>();
  const [user, setUser] = useState<UserType>();
  const navToggler = () => {
    setMobileNav((pre) => !pre);
  };
  const closeOverlay = () => {
    setMobileNav(false);
  };

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

  return (
    <>
      <div
        className={mobileNav ? "overlay active" : "overlay"}
        onClick={closeOverlay}
      ></div>
      <nav className={mobileNav ? "topnav responsive" : "topnav"}>
        <button className="mobile-nav-toggle" onClick={navToggler}>
          <VscThreeBars />
        </button>
        <ul className="uList">
          <li>
            <a href="/">
              <Trans>Home</Trans>
            </a>
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
            ) : auth === undefined ? (
              <a id="ske-btn"></a>
            ) : (
              <a href="/login">
                <Trans>Login</Trans>
              </a>
            )}
          </li>
          <li>
            {auth === true ? (
              <MotherBtn btnName="Logout" />
            ) : auth === undefined ? (
              <a id="ske-btn"></a>
            ) : (
              <a href="/signup">
                <Trans>Signup</Trans>
              </a>
            )}
          </li>
        </ul>
        <LangSelector />
      </nav>
    </>
  );
}
