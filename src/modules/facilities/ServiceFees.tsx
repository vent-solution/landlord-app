import React from "react";
import { FacilitiesModel } from "./FacilityModel";
import FacilityServiceFeesList from "./serviceFees/FacilityServiceFeesList";

interface Props {
  facility: FacilitiesModel;
}
const ServiceFees: React.FC<Props> = ({ facility }) => {
  return (
    <div>
      <FacilityServiceFeesList facility={facility} />
    </div>
  );
};

export default ServiceFees;
