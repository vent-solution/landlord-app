import React, { useEffect, useState } from "react";
import { NavLinkModel } from "../modules/users/models/navLinkModel";
import NavItem from "./navItem";
import { MdDashboard, MdNotifications } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { RxActivityLog, RxCross1 } from "react-icons/rx";
import { ImOffice, ImProfile } from "react-icons/im";
import { RiLogoutCircleLine } from "react-icons/ri";
import AlertMessage from "../other/alertMessage";
import ConfirmMessage from "../other/ConfirmMessage";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { setConfirm } from "../other/ConfirmSlice";
import { setUserAction } from "../global/actions/actionSlice";
import { useNavigate } from "react-router-dom";
import { logOutAction } from "../global/actions/logOut";
import { PiBuildingsFill } from "react-icons/pi";
import { FaBusinessTime, FaReceipt, FaUsers } from "react-icons/fa6";
import { IoDiamondSharp } from "react-icons/io5";

import navItems from "./navItems.json";
import { useLocation } from "react-router-dom";
import { ViewRightsModel } from "../modules/users/rights/viewRightsModel";

interface Props {}

let SideBar: React.FC<Props> = () => {
  const location = useLocation();

  const [navLinks, setNavLinks] = useState<NavLinkModel[] | []>([]);

  const [showProfileButtons, setShowProfileButtons] = useState<boolean>(false);

  const [showLinks, setShowLinks] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const viewRights: ViewRightsModel = {
    dashboard: true,
    facilities: true,
    users: true,
    tenants: true,
    offices: true,
    market: true,
    receipts: true,
    logs: true,
    landlords: false,
    staffs: false,
    settings: false,
    subscription: false,
    brokerFees: false,
    bids: false,
    statistics: false,
    bookings: false,
    expenses: false,
    history: false,
    accommodations: false,
    rent: false,
  };

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const iconMap: Record<string, JSX.Element> = {
    MdDashboard: <MdDashboard />,
    PiBuildingsFill: <PiBuildingsFill />,
    FaUsers: <FaUsers />,
    IoDiamondSharp: <IoDiamondSharp />,
    ImOffice: <ImOffice />,
    FaBusinessTime: <FaBusinessTime />,
    FaReceipt: <FaReceipt />,
    RxActivityLog: <RxActivityLog />,
  };

  function IconRenderer({ iconName }: { iconName: string }) {
    return iconMap[iconName] || null;
  }

  // set which links the user can view depending on the module view rights for a particular user.
  useEffect(() => {
    const links = navItems.filter(
      (item) => viewRights[item.link as keyof typeof viewRights]
    );

    setNavLinks(links);
  }, []);

  // handle log out function
  const handelLogOut = async () => {
    logOutAction(dispatch, setLoading);
  };

  const toggleShowProfileButtons = () => {
    return setShowProfileButtons(!showProfileButtons);
  };

  return (
    <div
      className={`sideBar transition-all ease-in delay-150 ${
        !showLinks ? "h-30" : "h-dvh"
      } lg:h-dvh bg-blue-950 px-1 w-full  overflow-hidden`}
    >
      {/* SIDEBAR SECTION UPPER PART */}
      <div className="w-full h-1/6 flex flex-wrap items-center justify-around py-3 px-2 lg:px-5 text-center border-gray-400 border-b-2">
        <div
          className="logo  w-fit font-bold border-2 border-white rounded-full p-2 cursor-pointer lg:hover:bg-blue-800"
          onClick={() => (window.location.href = "/landlord/dashboard")}
        >
          <img
            className="w-6 h-6"
            src="/landlord/images/logo-no-background.png"
            alt=""
          />
        </div>
        <div className="notifications w-1/4 text-3xl flex items-center justify-center relative">
          <div className="notification-inner p-1 w-fit h-fit hover:bg-blue-800 cursor-pointer rounded-full border-2 border-white">
            <MdNotifications />
            {/* <span className="text-xs font-bold p-1 line-h text-white bg-red-700 py-0 rounded-full absolute top-0 right-11 lg:right-4 md:right-28 ">
              9+
            </span> */}
          </div>
        </div>
        <div className="profile w-10  transition-all ease-in-out delay-150">
          <div
            className="profile-image w-10 h-10 rounded-full hover:h-9 hover:w-9 cursor-pointer relative"
            style={{
              background: "url('/landlord/images/Anatoli-profile-pic.png')",
              backgroundSize: "cover",
            }}
            onClick={toggleShowProfileButtons}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 absolute bottom-0 right-0"></span>
          </div>
        </div>
        <div className="bars text-white text-3xl font-extrabold px-5 lg:hidden">
          {!showLinks ? (
            <FaBars onClick={() => setShowLinks(true)} />
          ) : (
            <RxCross1 onClick={() => setShowLinks(false)} />
          )}
        </div>
        {/* <h1 className="w-full text-sm font-bold uppercase text-start">lld-4</h1> */}
      </div>

      <div
        className={`py-5 w-full   items-center justify-center ${
          showProfileButtons ? "flex" : "hidden"
        }`}
      >
        <button
          className=" hover:bg-blue-900 font-bold text-left px-5 text-white flex items-center my-1"
          onClick={() => {
            const user = JSON.parse(
              localStorage.getItem("dnap-user") as string
            );
            navigate(`/users/${user.userId}`);
          }}
        >
          <span className="p-2">
            <ImProfile />
          </span>
          Profile
        </button>
        <button
          className=" hover:bg-blue-900 font-bold text-left px-5 text-white flex items-center my-1"
          onClick={() => {
            dispatch(
              setConfirm({
                message: "Are you sure you want to log out?",
                status: true,
              })
            );

            dispatch(setUserAction({ userAction: handelLogOut }));
          }}
        >
          <span className="p-2">
            <RiLogoutCircleLine />
          </span>
          {loading ? "Wait..." : "Log out"}
        </button>
      </div>

      {/* SIDEBAR SECTION FOR NAV LINKS */}
      <div
        className={`links bg-blue-950 lg:flex w-full ${
          !showLinks ? "hidden" : ""
        } flex-wrap    text-gray-400 text-lg   h-3/4 overflow-hidden`}
      >
        <div className="py-2 w-full  h-3/4 overflow-auto">
          {navLinks.map((navLink, index) => {
            const isActive = navLink.link === location.pathname;

            // If childLinks exist, assign active status
            const childLinks = navLink.childLinks?.map((child) => ({
              ...child,
              active: child.link === location.pathname,
            }));

            return (
              <NavItem
                key={index}
                navLink={{ ...navLink, active: isActive, childLinks }}
                icon={<IconRenderer iconName={navLink.icon} />}
                setShowLinks={setShowLinks}
              />
            );
          })}
        </div>

        <div
          className={`py-5 w-full items-center justify-center border-t text-sm`}
        >
          <button
            className="w-full hover:bg-blue-900 text-left px-5 text-white flex items-center my-1"
            onClick={() => {
              const user = JSON.parse(
                localStorage.getItem("dnap-user") as string
              );
              navigate(`/users/${user.userId}`);
            }}
          >
            <span className="p-2">
              <ImProfile />
            </span>
            Profile
          </button>
          <button
            className="w-full hover:bg-blue-900 text-left px-5 text-white flex items-center my-3"
            onClick={() => {
              dispatch(
                setConfirm({
                  message: "Are you sure you want to log out?",
                  status: true,
                })
              );

              dispatch(setUserAction({ userAction: handelLogOut }));
            }}
          >
            <span className="p-2">
              <RiLogoutCircleLine />
            </span>
            {loading ? "Wait..." : "Log out"}
          </button>
        </div>
      </div>

      <AlertMessage />

      <ConfirmMessage />
    </div>
  );
};

SideBar = React.memo(SideBar);

export default SideBar;
