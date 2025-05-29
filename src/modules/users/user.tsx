import React from "react";
import { UserModel } from "./models/userModel";
import { UserStatusEnum } from "../../global/enums/userStatusEnum";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Props {
  user: UserModel;
  userIndex: number;
}
const User: React.FC<Props> = ({ user, userIndex }) => {
  const joinedDate = user.createdDate ? parseISO(user.createdDate) : null;
  const lastActivity = user.lastUpdated ? parseISO(user.lastUpdated) : null;

  const navigate = useNavigate();

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

  // formating the date and time user's last activity
  const updated = lastActivity
    ? Date.now() - lastActivity.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(lastActivity, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(lastActivity, { addSuffix: true })
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
      onClick={() => navigate(`/users/${user.userId}`)}
    >
      {/* <td className={` py-5 flex justify-center items-center`}>
        <span
          className={` p-2 py-1  text-white rounded-full text-xs flex items-center justify-center ${
            user.userStatus === UserStatusEnum.disabled
              ? "bg-black"
              : user.userStatus === UserStatusEnum.enabled
              ? "bg-blue-600"
              : user.userStatus === UserStatusEnum.online
              ? "bg-green-600"
              : user.userStatus === UserStatusEnum.offline
              ? "bg-gray-500"
              : user.userStatus === UserStatusEnum.blocked
              ? "bg-red-600"
              : ""
          } `}
        >
          {userIndex + 1}
        </span>
      </td> */}
      <td className="px-2">USR-{user.userId}</td>
      <td className="px-2">{user.firstName}</td>
      <td className="px-2">{user.lastName}</td>
      <td className="px-2">{user.gender}</td>
      <td className="px-2">{user.userRole}</td>
      <td className="px-2">{user.userTelephone}</td>
      <td className="px-2">{user.userEmail}</td>
      <td className="px-2">{joined}</td>
      <td className="px-2">{updated}</td>
    </tr>
  );
};

export default User;
