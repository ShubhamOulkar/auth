import { Link } from "react-router-dom";
import { VscThreeBars } from "react-icons/vsc";
import React from "react";
import useAuthContext from "../auth context/useAuthContext";

export default function NavBar() {
  const { auth } = useAuthContext();

  return (
    <nav className="topnav" id="myTopnav">
      <ul className="uList">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          {auth !== null && (
            <Link to={auth ? "/profile" : "/login"}>
              {auth ? "profile" : "login"}
            </Link>
          )}
        </li>
        <li>
          {auth !== null && (
            <Link to={auth ? "/logout" : "/signup"}>
              {auth ? "logout" : "signup"}
            </Link>
          )}
        </li>
        <li>
          <a className="icon" onClick={myFunction}>
            <VscThreeBars />
          </a>
        </li>
      </ul>
    </nav>
  );
}

function myFunction() {
  let x = document.getElementById("myTopnav") as HTMLElement;
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
