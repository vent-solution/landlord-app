import React from "react";

interface Props {}
const Preloader: React.FC<Props> = () => {
  //   return (
  //     <div className="preloader">
  //       <div className="spinner"></div>
  //     </div>
  //   );

  return (
    <div className="preloader flex justify-center items-center fixed left-0 top-0 lg:left-24 z-50 w-full h-full">
      <div className="cube text-white text-lg font-bold">
        <div className="side side1 flex justify-center items-center p-1">
          Vent
        </div>
        <div className="side side2 flex justify-center items-center p-1">
          Vent
        </div>
        <div className="side side3 flex justify-center items-center p-1">
          Vent
        </div>
        <div className="side side4 flex justify-center items-center p-1">
          Vent
        </div>
        <div className="side side5 flex justify-center items-center p-1">
          Vent
        </div>
        <div className="side side6 flex justify-center items-center p-1">
          Vent
        </div>
      </div>
    </div>
  );
};

export default Preloader;
