import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
const NavBar = lazy(() => import("../components/NavigationBar"));
import SkeOutlet from "../components/skeleton/SkeOutlet";
import SkeNav from "../components/skeleton/SkeNav";
import Notification from "../components/Notification";

export default function Home() {
  return (
    <div className="home">
      <Notification />
      <Suspense fallback={<SkeNav />}>
        <NavBar />
      </Suspense>
      <Suspense fallback={<SkeOutlet />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
