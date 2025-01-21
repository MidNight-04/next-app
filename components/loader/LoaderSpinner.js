import React from "react";

const LoaderSpinner = () => {
  return (
    <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
      <div className="flex justify-center items-center mt-[50vh]">
        <div className="p-4 bg-gradient-to-tr animate-spin from-black to-yellow-500 via-white rounded-full">
          <div className="bg-white rounded-full">
            <div className="w-24 h-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderSpinner;
