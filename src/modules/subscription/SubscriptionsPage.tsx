import React, { useEffect, useState } from "react";
import { MdDashboard, MdPayment } from "react-icons/md";
import { FaBusinessTime, FaReceipt, FaUsers } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import SubscriptionsList from "./SubscriptionsList";
import { PiBuildingsFill } from "react-icons/pi";
import { UserModel } from "../users/models/userModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchSubscriptions } from "./SubscriptionSlice";
import { fetchUsers, getAllUsers } from "../users/usersSlice";

interface Props {}

const user: UserModel = JSON.parse(localStorage.getItem("dnap-user") as string);

const SubscriptionsPage: React.FC<Props> = () => {
  // LOCAL STATES
  const [navLinks] = useState<NavLinkModel[]>([
    {
      icon: <MdDashboard />,
      name: "Dashboard",
      link: "/dashboard",
      active: false,
    },

    {
      icon: <PiBuildingsFill />,
      name: "Facilties",
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
    {
      icon: <MdPayment />,
      name: "Subscription fees",
      link: "/subscription",
      active: true,
    },
    {
      icon: <IoDiamondSharp />,
      name: "Bids",
      link: "/bids",
      active: false,
    },

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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser] = useState<UserModel | null>(user);

  const dispatch = useDispatch<AppDispatch>();
  const usersState = useSelector(getAllUsers);
  const { landlordUsers } = usersState;

  // fetch all the landlord users
  useEffect(() => {
    dispatch(
      fetchUsers({ userId: Number(currentUser?.userId), page: 0, size: 25 })
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

  // fetch landlord users subscription
  useEffect(() => {
    const userIds: number[] = [];
    userIds.push(Number(currentUser?.userId));
    const IDs: number[] = landlordUsers.map((user) => Number(user.userId));

    userIds.push(...IDs);

    // window.alert(userIds);

    dispatch(fetchSubscriptions({ userId: userIds, page: 0, size: 20 }));
  }, [dispatch, currentUser?.userId, landlordUsers]);

  // render preloader screen if not authenticated or page still loading
  if (!isAuthenticated) {
    return <Preloader />;
  }

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div className="right lg:w-4/5 w-full z-0">
        <SubscriptionsList />
      </div>
    </div>
  );
};

export default SubscriptionsPage;
