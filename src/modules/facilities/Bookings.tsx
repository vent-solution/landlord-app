import React from "react";
import { FacilitiesModel } from "./FacilityModel";
import FacilityBookingsList from "./bookings/FacilityBookingsList";

interface Props {
  facility: FacilitiesModel;
}

const Bookings: React.FC<Props> = ({ facility }) => {
  return (
    <div>
      <FacilityBookingsList facility={facility} />
    </div>
  );
};

export default Bookings;
