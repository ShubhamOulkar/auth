import { Link } from "react-router-dom";
import { VscThreeBars } from "react-icons/vsc";
import { PiUserCircleGearBold } from "react-icons/pi";
import React, { useRef } from "react";
import useAuthContext from "../auth context/useAuthContext";
import MotherBtn from "./MotherBtn";

export default function NavBar() {
  const { auth, user } = useAuthContext();
  const nav = useRef<HTMLDivElement>(null);

  function myFunction(nav: HTMLElement | null) {
    if (nav) {
      nav?.classList.toggle("responsive");
    }
  }

  return (
    <nav
      className="topnav"
      id="myTopnav"
      ref={nav}
      onClick={() => myFunction(nav.current)}
    >
      <ul className="uList">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          {auth && (
            <Link to="/profile">
              {user?.picture ? (
                <img
                  className="navprofile"
                  src={user?.picture}
                  alt={`${user?.email} picture`}
                />
              ) : (
                <PiUserCircleGearBold />
              )}
              {user?.first}
            </Link>
          )}
          {!auth && <Link to="/login">Login</Link>}
        </li>
        <li>
          {auth ? (
            <MotherBtn btnName="Logout" />
          ) : (
            <Link to="/signup">Signup</Link>
          )}
        </li>
        <li>
          <a className="icon">
            <VscThreeBars />
          </a>
        </li>
      </ul>
    </nav>
  );
}
