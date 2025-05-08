import React from "react";
import { HistoryModel } from "./HistoryModel";
import { format, formatDistanceToNow, parseISO } from "date-fns";

interface Props {
  history: HistoryModel;
}
const FacilityHistoryRow: React.FC<Props> = ({ history }) => {
  const createdDate = history.checkIn ? parseISO(history.checkIn) : null;
  const lastUpdated = history.checkOut ? parseISO(history.checkOut) : null;

  // formating the checkIn  date and time
  const checkIn = createdDate
    ? Date.now() - createdDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(createdDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(createdDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  // formating the checkOut  date and time
  const checkOut = lastUpdated
    ? Date.now() - lastUpdated.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(lastUpdated, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(lastUpdated, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  return (
    <tr className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100">
      <td className="px-2 py-5">{history.accommodation.accommodationNumber}</td>
      <td className="px-2">{history.accommodation.floor}</td>
      <td className="px-2">{"TNT-" + history.tenant.tenantId}</td>
      <td className="px-2">
        {history.tenant.user.firstName + " " + history.tenant.user.lastName}
      </td>
      <td className="px-2">{history.tenant.user.userTelephone}</td>
      <td className="px-2">{history.tenant.user.userEmail}</td>
      <td className="px-2">{checkIn}</td>
      <td className="px-2">
        {history.checkIn !== history.checkOut && checkOut}
      </td>
    </tr>
  );
};

export default FacilityHistoryRow;
