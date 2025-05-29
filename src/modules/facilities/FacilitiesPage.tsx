import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaBusinessTime, FaUsers } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import { PiBuildingsFill } from "react-icons/pi";
import Facilities from "./Facilities";
import { FaReceipt } from "react-icons/fa";
import { UserModel } from "../users/models/userModel";

interface Props {}

const FacilitiesPage: React.FC<Props> = () => {
  // LOCAL STATES
  // const [navLinks] = useState<NavLinkModel[]>([
  //   {
  //     icon: <MdDashboard />,
  //     name: "Dashboard",
  //     link: `/dashboard`,
  //     active: false,
  //   },

  //   {
  //     icon: <PiBuildingsFill />,
  //     name: "Facilities",
  //     link: "/facilities",
  //     active: true,
  //   },

  //   {
  //     icon: <FaUsers />,
  //     name: "Users",
  //     link: "/users",
  //     active: false,
  //   },

  //   {
  //     icon: <IoDiamondSharp />,
  //     name: "Tenants",
  //     link: "/tenants",
  //     active: false,
  //   },

  //   {
  //     icon: <ImOffice />,
  //     name: "Our offices",
  //     link: "/offices",
  //     active: false,
  //   },
  //   // {
  //   //   icon: <MdPayment />,
  //   //   name: "Subscription fees",
  //   //   link: "/subscription",
  //   //   active: false,
  //   // },

  //   // {
  //   //   icon: <IoDiamondSharp />,
  //   //   name: "Bids",
  //   //   link: "/bids",
  //   //   active: false,
  //   // },

  //   {
  //     icon: <FaBusinessTime />,
  //     name: "Market place",
  //     link: "/market",
  //     active: false,
  //   },

  //   {
  //     icon: <FaReceipt />,
  //     name: "Receipts",
  //     link: "/receipts",
  //     active: false,
  //   },

  //   {
  //     icon: <RxActivityLog />,
  //     name: "Activity Logs",
  //     link: "/logs",
  //     active: false,
  //   },
  // ]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /*
   *create a delay of 3sec and check authication
   * to proceed to page or go back to login page
   */
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    if (currentUser.userId) {
      setIsAuthenticated(true);
    } else {
      window.location.href = `/${Number(currentUser.userId)}`;
    }
  }, []);

  // render preloader screen if not authenticated or page still loading
  if (!isAuthenticated) {
    return <Preloader />;
  }

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
