import React, { Suspense } from "react";
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
  Background,
  FormPage,
  TicketPage,
} from "../pages/PagesExporter";
import Spinner from "../components/Spinner";

export function Router() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* following routes are render inside home <Outlet/> */}
        <Route path="/" element={<Home />}>
          <Route index element={<ProjectInfoPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        {/* render new pages outside outlet*/}
        <Route path="/">
          <Route path="verifyemail" element={<VerifyEmail />} />
          <Route path="newpassword" element={<SetNewPassword />} />
        </Route>
        <Route path="/conf" element={<Background />}>
          <Route index element={<FormPage />} />
          <Route path="ticket" element={<TicketPage />} />
        </Route>
        <Route path="*" element={<InvalidReq />} />
      </Routes>
    </Suspense>
  );
}
