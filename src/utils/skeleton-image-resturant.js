import { Skeleton } from "@mui/material";
import React from "react";

const SkeletonImageRestaurant = () => {
  return (
    <div>
      <Skeleton
        animation="wave"
        variant="rectangular"
        width={375}
        height={240}
        sx={{ borderRadius: "20px" }}
      />
    </div>
  );
};

export default SkeletonImageRestaurant;
