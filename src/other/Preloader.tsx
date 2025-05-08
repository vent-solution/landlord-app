import React from "react";

interface Props {}
const Preloader: React.FC<Props> = () => {
  //   return (
  //     <div className="preloader">
  //       <div className="spinner"></div>
  //     </div>
  //   );

  return (
    <div className="preloader">
      <div className="cube text-white text-xl font-bold">
        <div className="side side1 flex justify-center items-center">Vent</div>
        <div className="side side2 flex justify-center items-center">Vent</div>
        <div className="side side3 flex justify-center items-center">Vent</div>
        <div className="side side4 flex justify-center items-center">Vent</div>
        <div className="side side5 flex justify-center items-center">Vent</div>
        <div className="side side6 flex justify-center items-center">Vent</div>
      </div>
    </div>
  );
};

export default Preloader;
