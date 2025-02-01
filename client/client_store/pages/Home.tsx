import React, { Suspense, lazy } from "react";
const NavBar = lazy(() => import("../components/NavigationBar"));
import SkeNav from "../components/skeleton/SkeNav";
import Notification from "../components/Notification";
export default function Home({ Outlet }: { Outlet: React.JSX.Element }) {
  return (
    <div className="home">
      <Notification />
      <Suspense fallback={<SkeNav />}>
        <NavBar />
      </Suspense>
      {Outlet}
    </div>
  );
}
