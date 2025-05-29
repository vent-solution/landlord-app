import React from "react";
import { HistoryModel } from "../history/HistoryModel";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { ACCOMMODATION_TYPE_DATA } from "../../../global/PreDefinedData/PreDefinedData";

interface Props {
  tenantIndex: number;
  // tenant: TenantModel;
  setTenantId: React.Dispatch<React.SetStateAction<number>>;
  setAccommodationId: React.Dispatch<React.SetStateAction<number>>;
  toggleShowTenantDetails: () => void;
  history: HistoryModel;
}

const Tenant: React.FC<Props> = ({
  history,
  tenantIndex,
  setTenantId,
  setAccommodationId,
  toggleShowTenantDetails,
}) => {
  const { tenant, accommodation, checkIn } = history;

  const checkinDate = checkIn ? parseISO(checkIn) : null;

  const checkedIn = checkinDate
    ? Date.now() - checkinDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(checkinDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(checkinDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : // Use relative time
      "";

  return (
    <tr
      className="cursor-pointer text-sm text-start border-y-2 hover:bg-gray-100"
      onClick={() => {
        setTenantId(Number(tenant.tenantId));
        setAccommodationId(Number(accommodation.accommodationId));
        toggleShowTenantDetails();
      }}
    >
      {/* <td className="py-5">{tenantIndex + 1}</td> */}
      {/* <td>{"FAC-" + accommodation.facility.facilityId}</td> */}
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
      <td>{checkedIn}</td>
    </tr>
  );
};

export default Tenant;
