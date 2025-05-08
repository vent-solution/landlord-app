import React from "react";
import { FacilitiesModel } from "./FacilityModel";
import AccommodationsList from "./accommodations/AccommodationsList";

interface Props {
  facility: FacilitiesModel;
}
const Accommodations: React.FC<Props> = ({ facility }) => {
  return (
    <div>
      <AccommodationsList facility={facility} />
    </div>
  );
};

export default Accommodations;
