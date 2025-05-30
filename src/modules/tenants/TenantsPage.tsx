import React, { useCallback, useEffect, useState } from "react";
import Preloader from "../../other/Preloader";
import SideBar from "../../sidebar/sideBar";
import Tenants from "./Tenants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchLandlordTenants, getLandlordTenants } from "./TenantsSlice";
import { getFacilities } from "../facilities/FacilitiesSlice";
import TenantDetails from "./TenantDetails";

interface Props {}
const TenantsPage: React.FC<Props> = () => {
  // LOCAL STATES

  const [showTenantDetails, setShowTenantDetails] = useState<boolean>(false);
  const [tenantId, setTenantId] = useState<number>(0);
  const [selectedAccommodationId, setSelectedAccommodationId] =
    useState<number>(0);

  const [, setIsAuthenticated] = useState(false);

  const tenantsState = useSelector(getLandlordTenants);
  const { status } = tenantsState;
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
      window.location.href = `${process.env.REACT_APP_ENTRY_APP_URL}`;
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
  if (status === "loading") {
    return <Preloader />;
  }

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar />
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
