import React from "react";
import { Attribution } from "../components/Attribution";
import { Outlet } from "react-router-dom";
import TopLine from "../../assets/images/line-top.svg";
import BottomLine from "../../assets/images/line-bottom.svg";
import Circle from "../../assets/images/pattern-circle.svg";
import Lines from "../../assets/images/pattern-lines.svg";
import "../conf.css";

export default function Background() {
  return (
    <div className="background">
      <img src={TopLine} className="topline" alt="b-t" />
      <img src={Lines} className="vericleline" alt="b-l" />
      <img src={Circle} className="circle" alt="b-c" />
      <img src={BottomLine} className="bottomline" alt="b-b" />
      <Outlet />
      <Attribution />
    </div>
  );
}
