import React from "react";
import VerifyEmail from "../../client_store/pages/VerifyEmail";
import SetNewPassword from "../../client_store/pages/SetNewPassword";
import Notification from "../../client_store/components/Notification";
import { Routes, Route, Outlet } from "react-router";

const Home = () => {
  return (
    <div className="home">
      <Notification />
      <Outlet />
    </div>
  );
};

export default function Router() {
  return (
    <Routes>
      <Route path="forgotpassword" element={<Home />}>
        <Route index element={<VerifyEmail />} />
        <Route path="newpassword" element={<SetNewPassword />} />
      </Route>
    </Routes>
  );
}
