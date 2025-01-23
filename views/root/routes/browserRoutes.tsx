import { Routes, Route } from "react-router";
import {
  Home,
  ProjectInfoPage,
  LoginPage,
  SignupPage,
  ProfilePage,
  VerifyEmail,
  SetNewPassword,
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
      {/* render new pages outside home outlet*/}
      <Route path="/">
        <Route path="verifyemail" element={<VerifyEmail />} />
        <Route path="newpassword" element={<SetNewPassword />} />
      </Route>
    </Routes>
  );
}
