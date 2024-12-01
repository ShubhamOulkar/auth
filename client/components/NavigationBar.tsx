import { Link } from "react-router-dom";
import { VscThreeBars } from "react-icons/vsc";
import React, { useRef } from "react";
import useAuthContext from "../auth context/useAuthContext";
import MotherBtn from "./MotherBtn";

export default function NavBar() {
  const { auth } = useAuthContext();
  const nav = useRef();

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
          {auth !== null && (
            <Link to={auth ? "/profile" : "/login"}>
              {auth ? "Profile" : "Login"}
            </Link>
          )}
        </li>
        <li>
          {auth !== null && auth ? (
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

function myFunction(nav: HTMLElement | undefined) {
  if (nav?.className === "topnav") {
    nav.className += " responsive";
  } else {
    nav.className = "topnav";
  }
}

function sendLogoutRequest() {
  fetch("http://127.0.0.1:5500/auth/logout", {
    method: "POST",
    body: "shubham logout",
    headers: {
      "Content-Type": "text/plain",
    },
  }).then((res) => console.log(res));
}
