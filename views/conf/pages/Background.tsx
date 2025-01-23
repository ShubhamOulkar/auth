import { Attribution } from "../components/Attribution";
import { Outlet } from "react-router";
import TopLine from "../assets/images/line-top.svg?url";
import BottomLine from "../assets/images/line-bottom.svg?url";
import Circle from "../assets/images/pattern-circle.svg?url";
import Lines from "../assets/images/pattern-lines.svg?url";

export default function Background() {
  return (
    <div className="background">
      <img src={TopLine} className="topline" alt="b-t" loading="lazy" />
      <img src={Lines} className="vericleline" alt="b-l" loading="lazy" />
      <img src={Circle} className="circle" alt="b-c" loading="lazy" />
      <img src={BottomLine} className="bottomline" alt="b-b" />
      <Outlet />
      <Attribution />
    </div>
  );
}
