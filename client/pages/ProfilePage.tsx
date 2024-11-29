import React, { useState } from "react";
import { useEffect } from "react";
import getCookie from "../utilities/getCookie";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [auth0, setAuth0] = useState(false);

  useEffect(() => {
    const key = getCookie("key");

    key instanceof Error ? setAuth0(false) : setAuth0(true);
  }, []);

  return (
    <>
      {auth0 ? (
        <h1>User Profile</h1>
      ) : (
        <p>
          User is not authenticated. <Link to="/login">Login</Link>
        </p>
      )}
    </>
  );
}

export default ProfilePage;
