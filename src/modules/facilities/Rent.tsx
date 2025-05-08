import React from "react";
import { FacilitiesModel } from "./FacilityModel";
import FacilityRentList from "./rent/FacilityRentList";

interface Props {
  facility: FacilitiesModel;
}

const Rent: React.FC<Props> = ({ facility }) => {
  return (
    <div>
      <FacilityRentList facilityId={facility.facilityId} />
    </div>
  );
};

export default Rent;
