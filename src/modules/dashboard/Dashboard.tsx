import React, { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaUsers, FaReceipt } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import { NavLinkModel } from "../users/models/navLinkModel";
import SideBar from "../../sidebar/sideBar";
import { PiBuildingsFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { getSettings } from "../settings/SettingsSlice";
import TotalEarnings from "./TotalEarnings";
import MonthlyEarnings from "./MonthlyEarnings";
import AnnualEarnings from "./AnnualEarnings";
import DailyEarnings from "./DailyEarnings";
import { FaBusinessTime } from "react-icons/fa";
import NumberOfFacilities from "./NumberOfFacilities";

interface Props {}

const Dashboard: React.FC<Props> = () => {
  const [navLinks] = useState<NavLinkModel[]>([
    {
      icon: <MdDashboard />,
      name: "Dashboard",
      link: `/dashboard`,
      active: true,
    },

    {
      icon: <PiBuildingsFill />,
      name: "Facilities",
      link: "/facilities",
      active: false,
    },

    {
      icon: <FaUsers />,
      name: "Users",
      link: "/users",
      active: false,
    },

    {
      icon: <IoDiamondSharp />,
      name: "Tenants",
      link: "/tenants",
      active: false,
    },

    {
      icon: <ImOffice />,
      name: "Our offices",
      link: "/offices",
      active: false,
    },
    // {
    //   icon: <MdPayment />,
    //   name: "Subscription fees",
    //   link: "/subscription",
    //   active: false,
    // },

    // {
    //   icon: <SiCoinmarketcap />,
    //   name: "Bids",
    //   link: "/bids",
    //   active: false,
    // },

    {
      icon: <FaBusinessTime />,
      name: "Market place",
      link: "/market",
      active: false,
    },

    {
      icon: <FaReceipt />,
      name: "Receipts",
      link: "/receipts",
      active: false,
    },

    {
      icon: <RxActivityLog />,
      name: "Activity Logs",
      link: "/logs",
      active: false,
    },
  ]);

  const settingsState = useSelector(getSettings);

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/4 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div
        className="right lg:w-full w-full h-svh px-0 lg:px-0 py-0 uppercase overflow-y-auto  mt-20 lg:mt-0"
        // style={{ height: "calc(100vh - 10px)" }}
      >
        {/* periodic total earning */}
        <TotalEarnings settings={settingsState.settings[0]} />

        {/* annual and monthly earning statistics*/}
        <div className="w-full h-fit text-sm flex flex-wrap justify-center items-center lg:p-5">
          {/* monthly earnings*/}
          <MonthlyEarnings settings={settingsState.settings[0]} />

          {/* Annual earnings*/}
          <AnnualEarnings settings={settingsState.settings[0]} />

          {/* daily earnings */}
          <DailyEarnings settings={settingsState.settings[0]} />

          {/* number of facilities in different categories */}
          <NumberOfFacilities />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
