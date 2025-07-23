import React from "react";
import { FaAngleRight } from "react-icons/fa6";
import SwitchButton from "./SwitchButton";
import { ViewRightsModel } from "./viewRightsModel";

interface Props {
  switchClickAction: (e: React.MouseEvent<HTMLDivElement>) => Promise<void>;
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>;
  viewRights: ViewRightsModel;
}

let UsersRights: React.FC<Props> = ({
  switchClickAction,
  setCurrentSection,
  viewRights,
}) => {
  return (
    <div
      id="Users"
      className="w-full px-3 lg:px-5 py-5 flex flex-wrap items-center border-2 border-gray-300 my-5 cursor-pointer lg:hover:bg-gray-200 transition-all delay-150 duration-300 "
      onClick={(e) => {
        setCurrentSection(e.currentTarget.id);
      }}
    >
      <h3 className="w-full text-lg font-bold mr-5 flex items-center justify-between">
        Users
        <FaAngleRight />
      </h3>
      <section>
        <div className="w-fit" id="users" onClick={(e) => switchClickAction(e)}>
          <SwitchButton element={viewRights["users"]} />
        </div>
        <p className="text-gray-700 w-full">
          {`Allow user (${viewRights.user?.firstName} ${viewRights.user?.lastName}) to view the list of users including the user's details for each user.`}
        </p>
      </section>
    </div>
  );
};

UsersRights = React.memo(UsersRights);

export default UsersRights;
