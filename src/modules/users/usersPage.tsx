import React, { useEffect, useState } from "react";
import UserList from "./usersList";
import SideBar from "../../sidebar/sideBar";
import Preloader from "../../other/Preloader";
import { UserModel } from "./models/userModel";

interface Props {}
const UsersPage: React.FC<Props> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null);

  // set current user parameter
  useEffect(() => {
    const user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    setCurrentUser(user);
  }, []);

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
        <UserList currentUser={currentUser} />
      </div>
    </div>
  );
};

export default UsersPage;
