import React, { useEffect, useState } from "react";
import SideBar from "../../sidebar/sideBar";
import OfficesList from "./OfficesList";

interface Props {}
const OfficesPage: React.FC<Props> = () => {
  // LOCAL STATES

  const [, setIsAuthenticated] = useState(false);

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

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar />
      </div>
      <div className="right lg:w-4/5 w-full z-0">
        <OfficesList />
      </div>
    </div>
  );
};

export default OfficesPage;
