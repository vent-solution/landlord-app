import React from "react";
import { FacilitiesModel } from "./FacilityModel";
import FacilityBidsList from "./bids/FacilityBidsList";

interface Props {
  facility: FacilitiesModel;
}

const Bids: React.FC<Props> = ({ facility }) => {
  return (
    <div>
      <FacilityBidsList facility={facility} />
    </div>
  );
};

export default Bids;
