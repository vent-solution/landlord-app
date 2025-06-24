import React, { useEffect, useState } from "react";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import SubscriptionsList from "./SubscriptionsList";
import { UserModel } from "../users/models/userModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchSubscriptions } from "./SubscriptionSlice";
import { fetchUsers, getAllUsers } from "../users/usersSlice";

interface Props {}

const user: UserModel = JSON.parse(localStorage.getItem("dnap-user") as string);

const SubscriptionsPage: React.FC<Props> = () => {
  // LOCAL STATES

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
        <SideBar />
      </div>
      <div className="right lg:w-4/5 w-full z-0">
        <SubscriptionsList />
      </div>
    </div>
  );
};

export default SubscriptionsPage;
