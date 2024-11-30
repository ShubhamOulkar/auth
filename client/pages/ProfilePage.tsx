import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../auth context/useAuthContext";
import Spinner from "../components/Spinner";

function ProfilePage() {
  const { auth } = useAuthContext();

  if (auth === null) {
    return <Spinner />;
  }

  return (
    <>
      {auth ? (
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
