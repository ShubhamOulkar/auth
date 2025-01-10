import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeForm = () => (
  <div className="home">
    <SkeletonTheme baseColor="#696969" highlightColor="#444">
      <Skeleton containerClassName="card-ske" height={300} />
    </SkeletonTheme>
  </div>
);

export default SkeForm;
