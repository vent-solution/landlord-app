import React from "react";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { OfficeModel } from "./OfficeModel";
import { useNavigate } from "react-router-dom";

interface Props {
  office: OfficeModel;
  officeIndex: number;
}

let Office: React.FC<Props> = ({ office, officeIndex }) => {
  const navigate = useNavigate();

  const createdDate = office.dateCreated ? parseISO(office.dateCreated) : null;

  const updatedDate = office.lastUpdated ? parseISO(office.lastUpdated) : null;

  // formating the date and time office created
  const created = createdDate
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

  // formating the date and time for office's update
  const updated = updatedDate
    ? Date.now() - updatedDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(updatedDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(updatedDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  return (
    <tr
      className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100"
      onClick={() => navigate(`${office.officeId}`)}
    >
      <td className="px-2 py-5">{officeIndex + 1}</td>
      <td className="px-2">{"OFF-" + office.officeId}</td>
      <td className="px-2">{office.officeLocation.country}</td>
      <td className="px-2">{office.officeLocation.city}</td>
      <td className="px-2">{office.officeLocation.street}</td>
      <td className="px-2">{office.officeContact.email}</td>
      <td className="px-2">{office.officeContact.telephone1}</td>
      <td className="px-2">{office.officeContact.telephone2}</td>
      <td className="px-2">{created}</td>
      <td className="px-2">{updated}</td>
    </tr>
  );
};

Office = React.memo(Office);

export default Office;
