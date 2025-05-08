import React, { useEffect, useState } from "react";
import { MdDashboard, MdPayment } from "react-icons/md";
import { FaBusinessTime, FaReceipt, FaUsers } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import Preloader from "../../other/Preloader";
import { getOfficeById } from "./OfficesSlice";
import OfficeDetails from "./OfficeDetails";
import { OfficeModel } from "./OfficeModel";
import OfficeStaff from "./OfficeStaff";
import { PiBuildingsFill } from "react-icons/pi";

const SingleOfficePage: React.FC = () => {
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
      name: `Users`,
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
      active: true,
    },
    // {
    //   icon: <MdPayment />,
    //   name: "Subscription fees",
    //   link: "/subscription",
    //   active: false,
    // },
    // {
    //   icon: <IoDiamondSharp />,
    //   name: "Bids",
    //   link: "/bids",
    //   active: false,
    // },

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

  const navigate = useNavigate();

  const { officeId } = useParams<{ officeId: string }>();

  const office = useSelector((state: any) =>
    getOfficeById(state, Number(officeId))
  );

  useEffect(() => {
    const currentUser = localStorage.getItem("dnap-user");
    if (!currentUser) {
      window.location.href = "/";
    }
  }, []);

  const [currentSection, setCurrentSection] = useState<string>("OfficeDetails");

  //   render section depending on the current active link
  const renderSection = (office: OfficeModel) => {
    switch (currentSection) {
      case "OfficeDetails":
        return <OfficeDetails office={office} />;
      case "OfficeStaff":
        return <OfficeStaff officeId={office.officeId} />;

      default:
        return <div>Select a section</div>;
    }
  };

  // function for selecting landlord section
  const selectSection = (li: HTMLLIElement) => {
    const { id } = li;
    const ul = li.parentElement;

    if (ul) {
      const lis = ul.querySelectorAll("li");
      lis.forEach((l) => {
        l !== li ? l.classList.remove("active") : l.classList.add("active");
      });
    }

    setCurrentSection(id); // Now setting the section name
  };

  if (!office) {
    return <Preloader />; // or a loading spinner
  }

  return (
    <div className="main max-h-screen overflow-auto lg:overflow-hidden flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div className="right lg:w-4/5 w-full z-0 mt-20 lg:mt-0 px-2 lg:px-0">
        <div className="w-full flex flex-wrap justify-between items-center bg-blue-200 pt-2">
          <div className="w-full lg:w-1/3 py-2 lg:py-0 flex justify-between lg:justify-around px-3 ">
            <button
              className="bg-blue-950 hover:bg-blue-800 text-sm text-white flex items-center p-1 px-3"
              onClick={() => navigate("/offices")}
            >
              <IoMdArrowRoundBack />
              Back
            </button>
            <h2 className="text-lg font-bold">
              {"OFF-" +
                office.officeId +
                " " +
                office.officeLocation.city +
                " " +
                office.officeLocation.country}
            </h2>
          </div>
          <ul className="w-full lg:w-2/3 flex flex-wrap justify-end lg:justify-center items-center text-xs lg:text-sm text-blue-900 tracking-wider uppercase px-3">
            <li
              id="OfficeDetails"
              className={`p-2 py-3 lg:p-5 font-bold hover:bg-gray-100 cursor-pointer active`}
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Details
            </li>

            <li
              id="OfficeStaff"
              className="p-2 lg:p-5 font-bold hover:bg-gray-100 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Staff
            </li>
          </ul>
        </div>
        {renderSection(office)}
      </div>
    </div>
  );
};

export default SingleOfficePage;
