import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeNav = () => (
  <div className="topnav">
    <SkeletonTheme baseColor="#696969" highlightColor="#444">
      <Skeleton containerClassName="topnav-ske" height={48} />
    </SkeletonTheme>
  </div>
);

export default SkeNav;
