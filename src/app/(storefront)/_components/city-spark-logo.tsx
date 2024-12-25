import React from "react";

const CitySparkLogo = () => {
  return (
    <div className="relative flex items-center">
      {/* Spark Icon */}
      <div className="relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-secondary rounded-full opacity-20 animate-pulse" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-8 h-8 relative z-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M12 2L4.5 20.5H12L10.5 22.5L19.5 12H13.5L15 4L12 2Z"
            className="fill-secondary stroke-secondary"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="ml-2 flex flex-col">
        <span className="text-2xl font-extrabold text-secondary tracking-tight leading-none">
          City Spark
        </span>
        <span className="text-xs text-secondary/80 tracking-wider leading-none">
          ELECTRICAL SUPPLIES
        </span>
      </div>
    </div>
  );
};

export default CitySparkLogo;
