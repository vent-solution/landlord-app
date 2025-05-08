import React from "react";
import { FacilitiesModel } from "./FacilityModel";
import StaffList from "./staff/StaffList";

interface Props {
  facility: FacilitiesModel;
}

const Staff: React.FC<Props> = ({ facility }) => {
  return (
    <div className="h-svh">
      {facility.manager ? (
        <StaffList manager={facility.manager && facility.manager} />
      ) : (
        <div className="w-ull h-5/6 flex justify-center items-center">
          <div
            className="w-80 h-80"
            style={{
              background: "URL('/images/Ghost.gif')",
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Staff;
