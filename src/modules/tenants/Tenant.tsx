import React from "react";
import { HistoryModel } from "../facilities/history/HistoryModel";
import { ACCOMMODATION_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";
import countriesList from "../../global/data/countriesList.json";

interface Props {
  history: HistoryModel;
  tenantIndex: number;
  setTenantId: React.Dispatch<React.SetStateAction<number>>;

  setSelectedAccommodationId: React.Dispatch<React.SetStateAction<number>>;
  toggleShowTenantDetails: () => void;
}

let Tenant: React.FC<Props> = ({
  history,
  setTenantId,
  toggleShowTenantDetails,
  setSelectedAccommodationId,
}) => {
  const { tenant, accommodation } = history;

  return (
    <tr
      className="cursor-pointer text-sm text-start border-y-2 hover:bg-gray-100"
      onClick={() => {
        setTenantId(Number(tenant.tenantId));
        toggleShowTenantDetails();
        setSelectedAccommodationId(Number(accommodation.accommodationId));
      }}
    >
      {/* <td className="py-4">{tenantIndex + 1}</td> */}
      <td className="px-2 pt-2 w-48">
        {`(FAC- ${accommodation.facility.facilityId}) ${
          accommodation.facility.facilityName
        }, ${accommodation.facility.facilityLocation.primaryAddress}, ${
          countriesList.find(
            (country) =>
              country.value === accommodation.facility.facilityLocation.country
          )?.label
        }`}
      </td>
      <td className="px-2 pt-2">{accommodation.accommodationNumber}</td>
      <td className="px-2 pt-2">{accommodation.floor}</td>
      <td className="px-2 pt-2">
        {
          ACCOMMODATION_TYPE_DATA.find(
            (type) => type.value === accommodation?.accommodationType
          )?.label
        }
      </td>
      <td className="px-2 pt-2">{"TNT-" + tenant.tenantId}</td>
      {tenant.companyName && (
        <td className="px-2 pt-2">{tenant.companyName}</td>
      )}
      {!tenant.companyName && (
        <td className="px-2 pt-2">
          {tenant.user.firstName + " " + tenant.user.lastName}
        </td>
      )}
      <td className="px-2 pt-2">{tenant.user.userTelephone}</td>
      <td className="px-2 pt-2">{tenant.user.userEmail}</td>
    </tr>
  );
};

Tenant = React.memo(Tenant);

export default Tenant;
