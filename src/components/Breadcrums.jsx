import React from "react";
import { PiGreaterThan } from "react-icons/pi";
import { Link } from "react-router-dom";

const Breadcrums = ({ currentPage, prevPages = [] }) => {
  return (
    <div className="container px-2   mt-5 flex gap-2 items-center">
      <Link to="/" className="text-base capitalize  sm:text-[18px] font-normal text-gray-500">
        Home
      </Link>{" "}
      {prevPages?.map((prev, i) => {
        return (
          <>
            <PiGreaterThan />
            <Link
              to={prev?.url}
              className="text-[15px] capitalize  sm:text-[17px] font-normal text-gray-500"
              key={i}
            >
              {prev?.name}
            </Link>
          </>
        );
      })}
      <PiGreaterThan />
      <span className="text-sm capitalize  sm:text-base font-normal">{currentPage}</span>
    </div>
  );
};

export default Breadcrums;
