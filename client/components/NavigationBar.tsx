import { Link } from "react-router-dom";
import { VscThreeBars } from "react-icons/vsc";
import React from "react";

export default function NavBar() {
  return (
    <nav className="topnav" id="myTopnav">
      <ul className="uList">
        <li>
          <Link to="/">home</Link>
        </li>
        <li>
          <Link to="/login">login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <Link className="icon" onClick={myFunction}>
            <VscThreeBars />
          </Link>
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
