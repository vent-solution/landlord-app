import React, { useEffect, useState } from "react";
import { ViewRightsModel } from "./viewRightsModel";
import SwitchButton from "./SwitchButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { getViewRights, updateViewRights } from "./viewRightsSlice";
import { putData } from "../../../global/api";
import axios from "axios";
import { setAlert } from "../../../other/alertSlice";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import DashboardRights from "./DashboardRights";
import FacilitiesRights from "./FacilitiesRights";
import UsersRights from "./UsersRights";
import { UserModel } from "../models/userModel";
import { FaStop, FaWatchmanMonitoring } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import TenantsRights from "./TenantsRights";
import OfficesRights from "./OfficesRights";
import MarketRights from "./MarketRights";
import ReceiptsRights from "./ReceiptsRights";
import LogsRights from "./LogsRights";
import AccommodationsRights from "./AccommodationsRights";

interface Props {
  userId: number;
  // viewRights: ViewRightsModel;
  // setViewRights: React.Dispatch<React.SetStateAction<ViewRightsModel>>;
}

let UserRights: React.FC<Props> = ({ userId }) => {
  const viewRightsState = useSelector(getViewRights);
  const { viewRights } = viewRightsState;

  const [currentSection, setCurrentSection] = useState<string>("");

  const [newRights, setNewRights] = useState<ViewRightsModel>(viewRights);
  const dispatch = useDispatch<AppDispatch>();

  const currentUser: UserModel = JSON.parse(
    localStorage.getItem("dnap-user") as string
  );

  // hide and show section details
  useEffect(() => {
    const parentSection = document.getElementById(`userRights`);
    const listDivs = parentSection?.querySelectorAll("div");

    listDivs?.forEach((dv) =>
      dv.id === currentSection
        ? dv.classList.add("active")
        : dv.classList.remove("active")
    );
  }, [currentSection]);

  // change the value of viewRights when a switch button is clicked
  const switchClickAction = async (e: React.MouseEvent<HTMLDivElement>) => {
    const { id } = e.currentTarget;

    setNewRights((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  // update user's view rights when the new rights state changes
  useEffect(() => {
    const updateRights = async () => {
      try {
        const result = await putData(
          `/update-view-rights/${userId}`,
          newRights
        );

        if (!result || result.status !== 200) {
          dispatch(
            setAlert({
              status: true,
              type: AlertTypeEnum.danger,
              message: "Internal server error!",
            })
          );
          return;
        }

        if (result.data.status && result.data.status !== "OK") {
          dispatch(
            setAlert({
              status: true,
              type: AlertTypeEnum.danger,
              message: result.data.message,
            })
          );
          return;
        }

        dispatch(updateViewRights(result.data));
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("UPDATE VIEW RIGHTS CANCELLED, ", error.message);
        }
      }
    };

    if (Number(userId) !== Number(currentUser.userId)) {
      updateRights();
    }
  }, [newRights]);

  if (Number(currentUser.userId) === Number(userId)) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xl">
        <CgDanger className="text-red-500 text-3xl" />
        <h1>You can't set your own user rights</h1>
      </div>
    );
  }
  return (
    <div className="w-full h-[calc(100vh-100px)] overflow-auto bg-gray-100 px-5 lg:px-10">
      {/* full rights */}
      <div className="full-rights w-full px-3 lg:px-5 py-5 flex flex-wrap items-center border-b-2 border-gray-400">
        <h3 className="w-fit text-lg font-bold mr-5">Full rights</h3>
        <div
          className="w-fit"
          id="fullRights"
          onClick={(e) => switchClickAction(e)}
        >
          <SwitchButton element={viewRights["fullRights"]} />
        </div>
        <p className="text-gray-700 w-full">
          {`Allow user ${viewRights.user?.firstName} ${viewRights.user?.lastName} to have full access to the system including viewing all
          modules (dashboard, facilities, users, tenants, offices, market,
          receipts, logs, expenses, rent and booking) and perform actions like
          adding, updating, and deleting for all modules.`}
        </p>
      </div>

      {!viewRights.fullRights && (
        <section id="userRights">
          {/* dashboard  */}
          <DashboardRights
            switchClickAction={switchClickAction}
            setCurrentSection={setCurrentSection}
            viewRights={viewRights}
          />

          {/* facilities  */}
          <FacilitiesRights
            switchClickAction={switchClickAction}
            setCurrentSection={setCurrentSection}
            viewRights={viewRights}
          />

          {/* accommodations  */}
          <AccommodationsRights
            switchClickAction={switchClickAction}
            setCurrentSection={setCurrentSection}
            viewRights={viewRights}
          />

          {/* users */}
          <UsersRights
            switchClickAction={switchClickAction}
            setCurrentSection={setCurrentSection}
            viewRights={viewRights}
          />

          {/* tenants  */}
          <TenantsRights
            switchClickAction={switchClickAction}
            setCurrentSection={setCurrentSection}
            viewRights={viewRights}
          />

          {/* offices */}
          <OfficesRights
            switchClickAction={switchClickAction}
            setCurrentSection={setCurrentSection}
            viewRights={viewRights}
          />

          {/* market  */}
          <MarketRights
            switchClickAction={switchClickAction}
            setCurrentSection={setCurrentSection}
            viewRights={viewRights}
          />

          {/* receipts  */}
          <ReceiptsRights
            switchClickAction={switchClickAction}
            setCurrentSection={setCurrentSection}
            viewRights={viewRights}
          />

          {/* logs  */}
          <LogsRights
            switchClickAction={switchClickAction}
            setCurrentSection={setCurrentSection}
            viewRights={viewRights}
          />
        </section>
      )}

      {/* <h1 className="text-xs font-bold">{JSON.stringify(viewRights)}</h1> */}
    </div>
  );
};

UserRights = React.memo(UserRights);
export default UserRights;
