import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import LoginForm from "../components/LoginForm";
import LogoutForm from "../components/LogoutForm";
import InvalidReq from "../components/InvalidReq";
import ProjectInfo from "../components/ProjectInfo";
import React from "react";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<ProjectInfo />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="signup" element={<LogoutForm />} />
      </Route>
      <Route path="*" element={<InvalidReq />} />
    </Routes>
  );
}
