import React, { useEffect } from "react";
import SideBar from "../../sidebar/sideBar";
import Facilities from "./Facilities";
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

  /*
   *create a delay of 3sec and check authication
   * to proceed to page or go back to login page
   */
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
