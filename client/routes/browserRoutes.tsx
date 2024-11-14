import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import LoginForm from "../components/LoginForm";
import InvalidReq from "../components/InvalidReq";
import ProjectInfo from "../components/ProjectInfo";
import React from "react";
import SignupForm from "../components/SignupForm";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<ProjectInfo />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="signup" element={<SignupForm />} />
      </Route>
      <Route path="*" element={<InvalidReq />} />
    </Routes>
  );
}
