import React from "react";
import { HistoryModel } from "../facilities/history/HistoryModel";
import { ACCOMMODATION_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";

interface Props {
  history: HistoryModel;
  tenantIndex: number;
  setTenantId: React.Dispatch<React.SetStateAction<number>>;

  setSelectedAccommodationId: React.Dispatch<React.SetStateAction<number>>;
  toggleShowTenantDetails: () => void;
}

let Tenant: React.FC<Props> = ({
  history,
  tenantIndex,
  setTenantId,
  toggleShowTenantDetails,
  setSelectedAccommodationId,
}) => {
  const { tenant, accommodation } = history;

  return (
    <tr
      className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100"
      onClick={() => {
        setTenantId(Number(tenant.tenantId));
        toggleShowTenantDetails();
        setSelectedAccommodationId(Number(accommodation.accommodationId));
      }}
    >
      <td className="py-4">{tenantIndex + 1}</td>
      <td>{"FAC-" + accommodation.facility.facilityId}</td>
      <td>{accommodation.accommodationNumber}</td>
      <td>{accommodation.floor}</td>
      <td>
        {
          ACCOMMODATION_TYPE_DATA.find(
            (type) => type.value === accommodation?.accommodationType
          )?.label
        }
      </td>
      <td>{"TNT-" + tenant.tenantId}</td>
      {tenant.companyName && <td>{tenant.companyName}</td>}
      {!tenant.companyName && (
        <td>{tenant.user.firstName + " " + tenant.user.lastName}</td>
      )}
      <td>{tenant.user.userTelephone}</td>
      <td>{tenant.user.userEmail}</td>
    </tr>
  );
};

Tenant = React.memo(Tenant);

export default Tenant;
