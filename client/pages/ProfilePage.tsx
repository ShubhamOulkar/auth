import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../auth context/useAuthContext";
import Spinner from "../components/Spinner";
import { ProfileCard } from "../components/ComponentExpoter";

function ProfilePage() {
  const { auth, user } = useAuthContext();

  if (auth === null) {
    return <Spinner />;
  }

  return (
    <>
      {auth ? (
        <ProfileCard user={user} />
      ) : (
        <p>
          User is not authenticated. <Link to="/login">Login</Link>
        </p>
      )}
    </>
  );
}

export default ProfilePage;
