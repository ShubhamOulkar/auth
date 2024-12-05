import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  ProjectInfoPage,
  LoginPage,
  SignupPage,
  ProfilePage,
  VerifyEmail,
  SetNewPassword,
  InvalidReq,
} from "../pages/PagesExporter";

export function Router() {
  return (
    <Routes>
      {/* following routes are render inside home <Outlet/> */}
      <Route path="/" element={<Home />}>
        <Route index element={<ProjectInfoPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      {/* render new pages */}
      <Route path="/">
        <Route path="verifyemail" element={<VerifyEmail />} />
        <Route path="newpassword" element={<SetNewPassword />} />
      </Route>
      <Route path="*" element={<InvalidReq />} />
    </Routes>
  );
}
