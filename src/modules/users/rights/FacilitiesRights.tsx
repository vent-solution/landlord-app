import React from "react";
import SwitchButton from "./SwitchButton";
import { ViewRightsModel } from "./viewRightsModel";
import { FaAngleRight } from "react-icons/fa6";

interface Props {
  switchClickAction: (e: React.MouseEvent<HTMLDivElement>) => Promise<void>;
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>;
  viewRights: ViewRightsModel;
}

let FacilitiesRights: React.FC<Props> = ({
  switchClickAction,
  setCurrentSection,
  viewRights,
}) => {
  return (
    <div
      id="Facilities"
      className="w-full px-3 lg:px-5 py-5 flex flex-wrap items-center border-2 border-gray-300 my-5 cursor-pointer lg:hover:bg-gray-200 transition-all delay-150 duration-300 "
      onClick={(e) => {
        setCurrentSection(e.currentTarget.id);
      }}
    >
      <h3 className="w-full text-lg font-bold mr-5 flex items-center justify-between">
        Facilities
        <FaAngleRight />
      </h3>
      <section>
        <div
          className="w-fit flex items-center"
          id="facilities"
          onClick={(e) => switchClickAction(e)}
        >
          <h4 className="text sm font-bold mr-5">View facilities</h4>
          <SwitchButton element={viewRights["facilities"]} />
        </div>
        <p className="text-gray-700 w-full">
          {`Allow user (${viewRights.user?.firstName} ${viewRights.user?.lastName}) to view the list of facilities including the facility details for each facility.`}
        </p>
      </section>
    </div>
  );
};

FacilitiesRights = React.memo(FacilitiesRights);

export default FacilitiesRights;
