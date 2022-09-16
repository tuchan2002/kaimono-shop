import React from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";

let rate = 0;
const Rating = ({ props, size }) => {
  if (props.numReviews) {
    rate = 100 - (props.star / props.numReviews) * 20;
  } else {
    rate = 100 - props.star * 20;
  }

  const styleStar = {
    clipPath: props.star === 0 ? `inset(0 100% 0 0)` : `inset(0 ${rate}% 0 0)`,
  };
  return (
    <div className="flex items-center gap-8">
      <div className="flex relative">
        <IoStarOutline
          size={size === "small" ? 15 : 28}
          className="text-yellow-400"
        />
        <IoStarOutline
          size={size === "small" ? 15 : 28}
          className="text-yellow-400"
        />
        <IoStarOutline
          size={size === "small" ? 15 : 28}
          className="text-yellow-400"
        />
        <IoStarOutline
          size={size === "small" ? 15 : 28}
          className="text-yellow-400"
        />
        <IoStarOutline
          size={size === "small" ? 15 : 28}
          className="text-yellow-400"
        />
        <div className="flex absolute left-0 top-0" style={styleStar}>
          <IoStar
            size={size === "small" ? 15 : 28}
            className="text-yellow-400"
          />
          <IoStar
            size={size === "small" ? 15 : 28}
            className="text-yellow-400"
          />
          <IoStar
            size={size === "small" ? 15 : 28}
            className="text-yellow-400"
          />
          <IoStar
            size={size === "small" ? 15 : 28}
            className="text-yellow-400"
          />
          <IoStar
            size={size === "small" ? 15 : 28}
            className="text-yellow-400"
          />
        </div>
      </div>
    </div>
  );
};

export default Rating;
