import React from "react";
import { FaAngleRight } from "react-icons/fa6";
import SwitchButton from "./SwitchButton";
import { ViewRightsModel } from "./viewRightsModel";

interface Props {
  switchClickAction: (e: React.MouseEvent<HTMLDivElement>) => Promise<void>;
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>;
  viewRights: ViewRightsModel;
}

let DashboardRights: React.FC<Props> = ({
  switchClickAction,
  setCurrentSection,
  viewRights,
}) => {
  return (
    <div
      id="Dashboard"
      className="w-full px-3 lg:px-5 py-5 flex flex-wrap items-center border-2 border-gray-300 my-5 cursor-pointer lg:hover:bg-gray-200 transition-all delay-150 duration-300 "
      onClick={(e) => {
        setCurrentSection(e.currentTarget.id);
      }}
    >
      <h3 className="w-full text-lg font-bold mr-5 flex items-center justify-between">
        Dashboard
        <FaAngleRight />
      </h3>
      <section>
        <div
          className="w-fit flex items-center"
          id="dashboard"
          onClick={(e) => switchClickAction(e)}
        >
          <h4 className="text sm font-bold mr-5">View dashboard</h4>
          <SwitchButton element={viewRights["dashboard"]} />
        </div>
        <p className="text-gray-700 w-full">
          {`Allow user (${viewRights.user?.firstName} ${viewRights.user?.lastName}) to view dashboard including total and net income and expense for all facilities and periodic graphs showing the earning for a given period.`}
        </p>
      </section>
    </div>
  );
};

DashboardRights = React.memo(DashboardRights);
export default DashboardRights;
