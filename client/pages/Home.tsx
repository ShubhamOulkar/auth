import { Outlet } from "react-router-dom";
import NavBar from "../components/NavigationBar";
import React from "react";
import Notification from "../components/Notification";

export default function Home() {
  return (
    <div className="home">
      <Notification />
      <NavBar />
      <Outlet />
    </div>
  );
}
