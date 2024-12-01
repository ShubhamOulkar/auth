import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../auth context/useAuthContext";
import Spinner from "../components/Spinner";
import { UserType } from "../types/userType";
import MotherBtn from "../components/MotherBtn";

function ProfilePage() {
  const { auth } = useAuthContext();
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    if (auth) {
      const storageString = localStorage.getItem(
        import.meta.env.VITE_LOCALSTORAGE_NAME
      );
      const userObject: UserType = storageString && JSON.parse(storageString);
      console.log("local storage:", storageString);
      typeof userObject === "object" ? setUser(userObject) : setUser({});
    }
  }, [auth]);

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
          <MotherBtn btnName="Delete user" />
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
