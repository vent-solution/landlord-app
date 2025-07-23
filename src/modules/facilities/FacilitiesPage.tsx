import React, { useEffect } from "react";
import SideBar from "../../sidebar/sideBar";
import Facilities from "./Facilities";
import { UserModel } from "../users/models/userModel";

interface Props {}

const FacilitiesPage: React.FC<Props> = () => {
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    if (!currentUser.userId) {
      window.location.href = `/landlord/${Number(currentUser.userId)}`;
    }
  }, []);

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar />
      </div>
      <div className="right lg:w-4/5 w-full z-0">
        <Facilities />
      </div>
    </div>
  );
};

export default FacilitiesPage;
