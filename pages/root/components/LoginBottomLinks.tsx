import React from "react";
import { Link } from "react-router";
import {
  use2FaContext,
  useNotificationContext,
} from "../context/customUseContextExporters";

function LoginBottomLinks() {
  const { setFa } = use2FaContext();
  const { setNotification } = useNotificationContext();

  const clickHandler = () => {
    console.log("user is using Forgot password....");
    setFa(true);
    setNotification({ msg: "Do not refresh the page" });
  };

  return (
    <div className="login-bottom-link">
      <Link className="card-link" to="/verifyemail" onClick={clickHandler}>
        Forgot password
      </Link>
      <Link className="card-link" to="/signup">
        Signup
      </Link>
    </div>
  );
}

export default LoginBottomLinks;
