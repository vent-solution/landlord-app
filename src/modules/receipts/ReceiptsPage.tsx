import React, { useEffect, useState } from "react";
import SideBar from "../../sidebar/sideBar";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { fetchReceipts } from "./receiptsSlice";
import { UserModel } from "../users/models/userModel";
import ReceiptsList from "./ReceiptsList";

interface Props {}

const ReceiptsPage: React.FC<Props> = () => {
  // LOCAL STATES

  const [, setIsAuthenticated] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  /*
   *create a delay of 3sec and check authication
   * to proceed to page or go back to login page
   */
  useEffect(() => {
    const currentUser = localStorage.getItem("dnap-user");
    if (currentUser) {
      setIsAuthenticated(true);
    } else {
      window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
    }
  }, []);

  // fetch receipts that belong to the current user
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    dispatch(
      fetchReceipts({ userId: Number(currentUser.userId), page: 0, size: 100 })
    );
  }, [dispatch]);

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar />
      </div>
      <div className="right lg:w-4/5 w-full z-0">
        <ReceiptsList />
      </div>
    </div>
  );
};

export default ReceiptsPage;
