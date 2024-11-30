import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../auth context/useAuthContext";
import Spinner from "../components/Spinner";
import { UserType } from "../types/userType";

function ProfilePage() {
  const { auth } = useAuthContext();
  const [user, setUser] = useState<UserType | null>();

  useEffect(() => {
    const storageString = localStorage.getItem("auth_ssr_user");
    const userObject = storageString && JSON.parse(storageString);
    console.log(storageString);
    setUser(userObject);
  });

  if (auth === null) {
    return <Spinner />;
  }

  return (
    <>
      {auth ? (
        <div>
          <h1>User Profile</h1>
          <p>Name: {user?.first}</p>
          <p>Surname: {user?.last}</p>
          <p>Email: {user?.email}</p>
          <img src={user?.picture} alt={`${user?.email} picture`} />
        </div>
      ) : (
        <p>
          User is not authenticated. <Link to="/login">Login</Link>
        </p>
      )}
    </>
  );
}

export default ProfilePage;
