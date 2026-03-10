import React, { useEffect, useRef, type RefObject } from "react";

interface Props {}

const CardNumber = ({}: Props) => {
  return (
    <div
      className="text-white uppercase text-[0.5rem] 2xsm:text-[0.525rem]
          xsm:text-[0.6562rem] sm:text-sm mb-10"
    >
      Bullets for numbers
    </div>
  );
};

export default CardNumber;
