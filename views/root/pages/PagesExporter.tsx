import { lazy } from "react";
const Home = lazy(() => import("../pages/Home"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const ProjectInfoPage = lazy(() => import("../pages/ProjectInfoPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const SetNewPassword = lazy(() => import("../pages/SetNewPassword"));

export {
  Home,
  LoginPage,
  SignupPage,
  ProjectInfoPage,
  ProfilePage,
  VerifyEmail,
  SetNewPassword,
};
