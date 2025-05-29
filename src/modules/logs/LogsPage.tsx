import React, { useEffect, useState } from "react";
import { FaBusinessTime, FaReceipt, FaUsers } from "react-icons/fa";
import { ImOffice } from "react-icons/im";
import { IoDiamondSharp } from "react-icons/io5";
import { MdDashboard, MdPayment } from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import LogsList from "./LogsList";
import { PiBuildingsFill } from "react-icons/pi";
import { UserModel } from "../users/models/userModel";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, getAllUsers } from "../users/usersSlice";
import { AppDispatch } from "../../app/store";
import { fetchLogs } from "./LogsSlice";

interface Props {}

const user: UserModel = JSON.parse(localStorage.getItem("dnap-user") as string);

const LogsPage: React.FC<Props> = () => {
  // LOCAL STATES
  // const [navLinks] = useState<NavLinkModel[]>([
  //   {
  //     icon: <MdDashboard />,
  //     name: "Dashboard",
  //     link: "/dashboard",
  //     active: false,
  //   },

  //   {
  //     icon: <PiBuildingsFill />,
  //     name: "Facilties",
  //     link: "/facilities",
  //     active: false,
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
  //     active: true,
  //   },
  // ]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser] = useState<UserModel | null>(user);

  const dispatch = useDispatch<AppDispatch>();

  const usersState = useSelector(getAllUsers);
  const { landlordUsers } = usersState;

  useEffect(() => {
    dispatch(
      fetchUsers({ userId: Number(currentUser?.userId), page: 0, size: 10 })
    );
  }, [currentUser?.userId, dispatch]);

  /*
   *create a delay of 3sec and check authication
   * to proceed to page or go back to login page
   */
  useEffect(() => {
    const currentUser = localStorage.getItem("dnap-user");
    if (currentUser) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/";
    }
  }, []);

  // fetch user logs
  useEffect(() => {
    const userIdList: number[] = [];
    userIdList.push(Number(currentUser?.userId));
    const IDs = landlordUsers.map((user) => Number(user.userId));

    userIdList.push(...IDs);

    dispatch(fetchLogs({ userId: userIdList, page: 0, size: 25 }));
  }, [currentUser?.userId, landlordUsers, dispatch]);

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
        <LogsList />
      </div>
    </div>
  );
};

export default LogsPage;
