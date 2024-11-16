import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import LoginPage from "../pages/LoginPage";
import InvalidReq from "../components/InvalidReq";
import React from "react";
import SignupPage from "../pages/SignupPage";
import ProjectInfoPage from "../pages/ProjectInfoPage";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<ProjectInfoPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
      <Route path="*" element={<InvalidReq />} />
    </Routes>
  );
}
