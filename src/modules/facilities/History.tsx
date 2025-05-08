import React from "react";
import { FacilitiesModel } from "./FacilityModel";
import FacilityHistoryList from "./history/FacilityHistoryList";

interface Props {
  facility: FacilitiesModel;
}

const Histories: React.FC<Props> = ({ facility }) => {
  return (
    <div className="">
      <FacilityHistoryList facility={facility} />
    </div>
  );
};

export default Histories;
