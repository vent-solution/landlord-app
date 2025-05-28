import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { LogModel } from "./LogModel";

interface Props {
  log: LogModel;
  logIndex: number;
}

let Log: React.FC<Props> = ({ log, logIndex }) => {
  const createdDate = log.dateCreated ? parseISO(log.dateCreated) : null;

  // formating the date and time Subscription created
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

  return (
    <tr className="cursor-pointer text-start border-y-2 hover:bg-gradient-to-b  hover:from-gray-100 hover:via-gray-100 hover:to-gray-100  bg-gradient-to-b from-white to-white">
      {/* <td className="px-2 pt-8">{logIndex + 1}</td> */}
      {/* <td className="px-2">{"LOG-" + log.logId}</td> */}

      <td className="px-2 pt-1">
        {log.user?.userId && "USR-" + log.user?.userId}
      </td>

      <td className="px-2">
        {log.user?.firstName && log.user?.firstName + " " + log.user?.lastName}
      </td>
      <td className="px-2">{log.user?.userRole && log.user?.userRole}</td>
      <td className="px-2">{log.activity}</td>
      <td className="px-2 w-80 pt-2">{log.description}</td>
      <td
        className={`px-2 text-sm ${
          log.status === "failed" ? "text-red-500" : "text-green-600"
        }`}
      >
        {log.status}
      </td>

      <td className="px-2">{created}</td>
    </tr>
  );
};

Log = React.memo(Log);

export default Log;
