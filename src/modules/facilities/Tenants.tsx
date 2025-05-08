import React, { useCallback, useState } from "react";
import { FacilitiesModel } from "./FacilityModel";
import TenantsList from "./tenants/FacilityTenantsList";
import { useSelector } from "react-redux";
import { getFacilityTenants } from "./tenants/TenantsSlice";
import TenantDetails from "./tenants/TenantDetails";

interface Props {
  facility: FacilitiesModel;
}

let Tenants: React.FC<Props> = ({ facility }) => {
  const [showTenantDetails, setShowTenantDetails] = useState<boolean>(false);
  const [tenantId, setTenantId] = useState<number>(0);
  const [accommodationId, setAccommodationId] = useState<number>(0);

  const tenantsState = useSelector(getFacilityTenants);

  const tenant = tenantsState.facilityTenants.map((history) => history.tenant);

  const checkIn = tenantsState.facilityTenants.map(
    (history) => history.checkIn
  );

  // handle toggle show tenant details
  const toggleShowTenantDetails = useCallback(() => {
    setShowTenantDetails(!showTenantDetails);
  }, [showTenantDetails]);

  return (
    <div className="w-full h-[calc(100vh-130px)] overflow-auto">
      {!showTenantDetails && (
        <TenantsList
          facility={facility}
          setTenantId={setTenantId}
          setAccommodationId={setAccommodationId}
          toggleShowTenantDetails={toggleShowTenantDetails}
        />
      )}
      {showTenantDetails && (
        <TenantDetails
          tenant={tenant.find((tnt) => tnt.tenantId === tenantId)}
          accommodationId={accommodationId}
          checkIn={checkIn[0]}
          toggleShowTenantDetails={toggleShowTenantDetails}
        />
      )}
    </div>
  );
};

Tenants = React.memo(Tenants);

export default Tenants;
