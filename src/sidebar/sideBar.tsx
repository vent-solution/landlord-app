import React, { useState } from "react";
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
import { UserModel } from "../modules/users/models/userModel";
import { useNavigate } from "react-router-dom";
import { logOutAction } from "../global/actions/logOut";
import { PiBuildingsFill } from "react-icons/pi";
import { FaBusinessTime, FaReceipt, FaUsers } from "react-icons/fa6";
import { IoDiamondSharp } from "react-icons/io5";

import navItems from "../global/navItems.json";

interface Props {}

const user: UserModel = JSON.parse(localStorage.getItem("dnap-user") as string);

let SideBar: React.FC<Props> = () => {
  const [navLinks, setNavLinks] = useState<NavLinkModel[]>(navItems);

  const [showProfileButtons, setShowProfileButtons] = useState<boolean>(false);

  const [showLinks, setShowLinks] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser] = useState<UserModel>(user);

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
      <div className="w-full h-1/6 flex items-center justify-around py-3 px-2 lg:px-10 text-center border-gray-400 border-b-2">
        <div className="logo  w-fit font-bold border-2 border-white rounded-full p-2">
          <img
            className="w-6 h-6"
            src="/images/logo-no-background.png"
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
              background: "url('/images/Anatoli-profile-pic.jpeg')",
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
      </div>

      <div
        className={`py-5 w-full   items-center justify-center ${
          showProfileButtons ? "flex" : "hidden"
        }`}
      >
        <button
          className=" hover:bg-blue-900 font-bold text-left px-5 text-white flex items-center my-1"
          onClick={() => navigate(`/users/${currentUser.userId}`)}
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
        } h-3/4 flex-wrap   overflow-auto text-gray-400 text-lg`}
      >
        <div className="py-2 w-full">
          {navLinks.map((navLink, index) => (
            <NavItem
              key={index}
              navLink={navLink}
              icon={<IconRenderer iconName={navLink.icon} />}
              setNavLinks={setNavLinks}
              navLinks={navLinks}
            />
          ))}
        </div>
      </div>

      <AlertMessage />

      <ConfirmMessage />
    </div>
  );
};

SideBar = React.memo(SideBar);

export default SideBar;
