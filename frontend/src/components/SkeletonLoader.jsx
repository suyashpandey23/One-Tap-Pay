import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = ({ count, height, width, circle }) => {
  return (
    <Skeleton count={count} height={height} width={width} circle={circle} />
  );
};

export default SkeletonLoader;
