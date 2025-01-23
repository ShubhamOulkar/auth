import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeOutlet() {
  return (
    <div className="card">
      <SkeletonTheme baseColor="#696969" highlightColor="#444">
        <Skeleton containerClassName="card-ske" height={400} />
      </SkeletonTheme>
    </div>
  );
}
