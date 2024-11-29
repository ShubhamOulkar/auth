import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import InvalidReq from "../pages/InvalidReq";
import React, { useState, useEffect } from "react";
import SignupPage from "../pages/SignupPage";
import ProjectInfoPage from "../pages/ProjectInfoPage";
import ProfilePage from "../pages/ProfilePage";
import getCookie from "../utilities/getCookie";

const PrivateRoute = ({ children }) => {
  const [auth0, setAuth0] = useState(true);

  useEffect(() => {
    const key = getCookie("key");

    key instanceof Error ? setAuth0(false) : setAuth0(true);
  }, []);

  return auth0 ? children : <Navigate to="/login" />;
};

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<ProjectInfoPage />} />
        <Route
          path="login"
          element={<LoginPage />}
          // errorElement={<ErrorPage />}
        />
        <Route path="signup" element={<SignupPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<InvalidReq />} />
    </Routes>
  );
}
