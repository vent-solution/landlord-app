import React from "react";
import { UserModel } from "../../users/models/userModel";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow, parseISO } from "date-fns";

interface Props {
  staff: UserModel;
  staffIndex: number;
}

const StaffRow: React.FC<Props> = ({ staff, staffIndex }) => {
  const navigate = useNavigate();

  const joinedDate = staff.createdDate ? parseISO(staff.createdDate) : null;

  // formating the date and time user joined
  const joined = joinedDate
    ? Date.now() - joinedDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(joinedDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(joinedDate, { addSuffix: true })
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
      onClick={() => navigate(`/users/${staff.userId}`)}
    >
      <td className={` py-5 flex justify-center items-center`}>
        {staffIndex + 1}
      </td>
      <td className="px-2">USR-{staff.userId}</td>
      <td className="px-2">{staff.firstName}</td>
      <td className="px-2">{staff.lastName}</td>
      <td className="px-2">{staff.gender}</td>
      <td className="px-2">{staff.userRole}</td>
      <td className="px-2">{staff.userTelephone}</td>
      <td className="px-2">{staff.userEmail}</td>
      <td className="px-2">{joined}</td>
    </tr>
  );
};

export default StaffRow;
