import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import Preloader from "../../other/Preloader";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { fetchData } from "../../global/api";
import PaginationButtons from "../../global/PaginationButtons";
import Log from "../logs/Log";
import { LogModel } from "../logs/LogModel";
import { fetchLogs, getLogs, resetLogs } from "../logs/LogsSlice";

interface Props {
  userId: number;
}

let UserActivityList: React.FC<Props> = ({ userId }) => {
  // local state variabes
  const [searchString, setSearchString] = useState<string>("");
  const [filteredLogs, setFilteredLogs] = useState<LogModel[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const logsState = useSelector(getLogs);
  const { userLogs, status, error, page, size, totalElements, totalPages } =
    logsState;

  // fetch user logs
  useEffect(() => {
    dispatch(fetchLogs({ userId: [userId], page: 0, size: 25 }));
  }, [userId, dispatch]);

  // filter user logs
  useEffect(() => {
    const originalLogs =
      userLogs.length > 0
        ? [...userLogs].sort((a, b) => {
            const aLogId = a.logId ? parseInt(a.logId, 10) : 0;
            const bLogId = b.logId ? parseInt(b.logId, 10) : 0;
            return bLogId - aLogId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredLogs(originalLogs);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredLogs(
        originalLogs.filter((log) => {
          const { user } = log;

          const logNumber = "LOG-" + log.logId;
          const userNumber = "USR-" + log.user?.userId;
          const logYear = new Date(`${log.dateCreated}`).getFullYear();
          const logMonth = new Date(`${log.dateCreated}`).getMonth() + 1;
          const logDay = new Date(`${log.dateCreated}`).getDate();
          const logDate = logDay + "/" + logMonth + "/" + logYear;
          return (
            (logDate && logDate.toLowerCase().includes(searchTerm)) ||
            (log.logId && logNumber.toLowerCase().includes(searchTerm)) ||
            (log.user?.userId &&
              userNumber.toLowerCase().includes(searchTerm)) ||
            (user?.firstName &&
              user.firstName.toLowerCase().includes(searchTerm)) ||
            (user?.lastName && user.lastName.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, userLogs]);

  // handle search event
  const handleSearchlogs = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-landlord-user-logs/${[userId]}/${page + 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetLogs(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LOGS CANCELLED ", error.message);
      }
    }
  }, [dispatch, page, size, userId]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-landlord-user-logs/${[userId]}/${page - 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetLogs(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH LOGS CANCELLED ", error.message);
      }
    }
  }, [dispatch, page, size, userId]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  return (
    <div className="relative h-[calc(100vh-100px)] bg-gray-200">
      {/* <div className="list w-full h-fit relative"> */}
      <div className="bg-white w-full">
        <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-3 lg:px-10 pt-3 bg-white">
          <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center pb-5">
            <div className="w-fit lg:w-1/2 flex justify-between lg:justify-around items-center">
              <h1 className="text-lg">
                {filteredLogs.length + "/" + totalElements}
              </h1>
            </div>
            <div
              className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-3/4 lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
            >
              <input
                type="text"
                name=""
                id="search-subscription"
                placeholder="Search for log..."
                className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                onChange={handleSearchlogs}
              />

              <button className="bg-blue-900 hover:bg-blue-600 text-white p-2 rounded-full text-xl text-center border ">
                {<FaSearch />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:px-5 overflow-auto h-[calc(100svh-270px)]">
        {filteredLogs.length > 0 ? (
          <table className="border-2 w-full bg-cyan-50 bordered mt-3 shadow-lg">
            <thead className="sticky top-0 bg-blue-900 text-base text-white">
              <tr>
                <th className="px-2">#</th>
                {/* <th className="px-2">Log number</th> */}
                <th className="px-2">User number</th>
                <th className="px-2">User full name</th>
                <th className="px-2">User role</th>
                <th className="px-2">Activity</th>
                <th className="px-2 w-1/3">Description</th>
                <th className="px-2">Status</th>
                <th className="px-2">Log date</th>
              </tr>
            </thead>
            <tbody className="text-black font-light">
              {filteredLogs.map((log: LogModel, index: number) => (
                <Log key={index} log={log} logIndex={index} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="w-ull h-full flex justify-center items-center">
            <div
              className="w-80 h-80"
              style={{
                background: "URL('/images/Ghost.gif')",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        )}
      </div>
      <PaginationButtons
        page={page}
        totalPages={totalPages}
        handleFetchNextPage={handleFetchNextPage}
        handleFetchPreviousPage={handleFetchPreviousPage}
      />
      {/* </div> */}
    </div>
  );
};

UserActivityList = React.memo(UserActivityList);
export default UserActivityList;
