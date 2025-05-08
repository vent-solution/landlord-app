import React from "react";
import { FacilitiesModel } from "./FacilityModel";
import { useSelector } from "react-redux";
import { getSettings } from "../settings/SettingsSlice";
import TotalEarnings from "./statistics/TotalEarnings";
import MonthlyEarnings from "./statistics/MonthlyEarnings";
import AnnualEarnings from "./statistics/AnnualEarnings";
import DailyEarnings from "./statistics/DailyEarnings";
import { findFacilityById } from "./FacilitiesSlice";
import { useParams } from "react-router-dom";

interface Props {
  facility: FacilitiesModel;
}

const Statistics: React.FC<Props> = () => {
  const { facilityId } = useParams();

  const settingsState = useSelector(getSettings);

  const facility = useSelector(findFacilityById(Number(facilityId)));

  return (
    <div className="right lg:w-full w-full h-svh lg:h-[calc(100vh-140px)] px-0 lg:px-0 py-0 uppercase overflow-y-auto  lg:mt-0">
      {/* periodic total earning */}
      <div className="lg:p-5">
        <TotalEarnings
          settings={settingsState.settings[0]}
          currency={facility?.preferedCurrency}
        />
      </div>

      {/* annual and monthly earning statistics*/}
      <div className="w-full h-fit text-sm flex flex-wrap justify-center items-center lg:px-5">
        {/* monthly earnings*/}
        <MonthlyEarnings
          settings={settingsState.settings[0]}
          currency={facility?.preferedCurrency}
          facilityId={facility?.facilityId}
        />

        {/* Annual earnings*/}
        <AnnualEarnings
          settings={settingsState.settings[0]}
          currency={facility?.preferedCurrency}
          facilityId={facility?.facilityId}
        />

        {/* daily earnings */}
        <DailyEarnings
          settings={settingsState.settings[0]}
          currency={facility?.preferedCurrency}
          facilityId={facility?.facilityId}
        />
      </div>
    </div>
  );
};

export default Statistics;
