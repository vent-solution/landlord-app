import React, { useCallback, useEffect, useState } from "react";
import { MdDashboard, MdPayment } from "react-icons/md";
import { FaBusinessTime, FaReceipt, FaUsers } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { RxActivityLog } from "react-icons/rx";
import { IoDiamondSharp } from "react-icons/io5";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import { NavLinkModel } from "../users/models/navLinkModel";
import { PiBuildingsFill } from "react-icons/pi";
import Tenants from "./Tenants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchLandlordTenants, getLandlordTenants } from "./TenantsSlice";
import { getFacilities } from "../facilities/FacilitiesSlice";
import TenantDetails from "./TenantDetails";

interface Props {}
const TenantsPage: React.FC<Props> = () => {
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
      active: true,
    },

    {
      icon: <ImOffice />,
      name: "Our offices",
      link: "/offices",
      active: false,
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

  const [showTenantDetails, setShowTenantDetails] = useState<boolean>(false);
  const [tenantId, setTenantId] = useState<number>(0);
  const [selectedAccommodationId, setSelectedAccommodationId] =
    useState<number>(0);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const tenantsState = useSelector(getLandlordTenants);
  const tenant = tenantsState.landlordTenants.map((history) => history.tenant);
  const accommodation = tenantsState.landlordTenants.map(
    (history) => history.accommodation
  );

  const checkIn = tenantsState.landlordTenants.map(
    (history) => history.checkIn
  );

  const dispatch = useDispatch<AppDispatch>();

  const facilitiesState = useSelector(getFacilities);

  const { facilities } = facilitiesState;

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

  // fetch landlord tenants
  useEffect(() => {
    dispatch(
      fetchLandlordTenants({
        facilityIDs: facilities.map((facility) => Number(facility.facilityId)),
        page: 0,
        size: 25,
      })
    );
  }, [dispatch, facilities]);

  // handle toggle show tenant details
  const toggleShowTenantDetails = useCallback(() => {
    setShowTenantDetails(!showTenantDetails);
  }, [showTenantDetails]);

  // render preloader screen if not authenticated or page still loading
  if (!isAuthenticated) {
    return <Preloader />;
  }

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar navLinks={navLinks} />
      </div>
      <div className="right h-svh overflow-auto lg:w-4/5 w-full z-0">
        {!showTenantDetails && (
          <Tenants
            // facility={accommodation[0].facility}
            setTenantId={setTenantId}
            toggleShowTenantDetails={toggleShowTenantDetails}
            setSelectedAccommodationId={setSelectedAccommodationId}
          />
        )}
        {showTenantDetails && (
          <TenantDetails
            tenant={tenant.find((tnt) => tnt.tenantId === tenantId)}
            checkIn={checkIn[0]}
            accommodation={accommodation.find(
              (acc) => Number(acc.accommodationId) === selectedAccommodationId
            )}
            toggleShowTenantDetails={toggleShowTenantDetails}
          />
        )}
      </div>
    </div>
  );
};

export default TenantsPage;
