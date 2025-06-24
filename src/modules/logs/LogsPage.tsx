import React, { useEffect } from "react";
import SideBar from "../../sidebar/sideBar";
import LogsList from "./LogsList";
import { UserModel } from "../users/models/userModel";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, getAllUsers } from "../users/usersSlice";
import { AppDispatch } from "../../app/store";
import { fetchLogs } from "./LogsSlice";

interface Props {}

const LogsPage: React.FC<Props> = () => {
  // LOCAL STATES

  const dispatch = useDispatch<AppDispatch>();

  const usersState = useSelector(getAllUsers);
  const { landlordUsers } = usersState;

  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    dispatch(
      fetchUsers({ userId: Number(currentUser?.userId), page: 0, size: 10 })
    );
  }, [dispatch]);

  /*
   *create a delay of 3sec and check authication
   * to proceed to page or go back to login page
   */
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    if (!currentUser) {
      window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
    }
  }, []);

  // fetch user logs
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    const userIdList: number[] = [];
    userIdList.push(Number(currentUser?.userId));
    const IDs = landlordUsers.map((user) => Number(user.userId));

    userIdList.push(...IDs);

    dispatch(fetchLogs({ userId: userIdList, page: 0, size: 25 }));
  }, [landlordUsers, dispatch]);

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
