import { Link } from "react-router-dom";
import { VscThreeBars } from "react-icons/vsc";
import React, { useState, useEffect } from "react";
import getCookie from "../utilities/getCookie";

export default function NavBar() {
  const [auth0, setAuth0] = useState(false);

  useEffect(() => {
    const key = getCookie("key");

    key instanceof Error ? setAuth0(false) : setAuth0(true);
  }, []);

  return (
    <nav className="topnav" id="myTopnav">
      <ul className="uList">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to={auth0 ? "/profile" : "/login"}>
            {auth0 ? "profile" : "login"}
          </Link>
        </li>
        <li>
          <Link to={auth0 ? "/logout" : "/signup"}>
            {auth0 ? "logout" : "signup"}
          </Link>
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
