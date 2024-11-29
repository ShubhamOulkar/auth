import { Outlet } from "react-router-dom";
import NavBar from "../components/NavigationBar";
import React from "react";

export default function Home() {
  return (
    <div className="home">
      <NavBar />
      <Outlet />
    </div>
  );
}
