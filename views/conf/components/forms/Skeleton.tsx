import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeConf = () => (
  <div>
    <SkeletonTheme baseColor="#0c082b" highlightColor="#444">
      <Skeleton containerClassName="card-ske" height={800} />
    </SkeletonTheme>
  </div>
);

export default SkeConf;
