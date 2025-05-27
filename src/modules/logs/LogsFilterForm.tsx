import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { setAlert } from "../../other/alertSlice";
import { fetchData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { UserModel } from "../users/models/userModel";
import { FaDownload } from "react-icons/fa";
import { downloadFilters } from "../../global/DownloadFiltersModel";

interface Props {
  isShowReportFilterForm: boolean;
  setIsShowReportFilterForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const currentUser: UserModel = JSON.parse(
  localStorage.getItem("dnap-user") as string
);

let LogsFilterForm: React.FC<Props> = ({
  isShowReportFilterForm,
  setIsShowReportFilterForm,
}) => {
  const [filters, setFilters] = useState<downloadFilters>({
    limit: 500,
    startDate: null,
    endDate: null,
    ownerId: null,
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // set default download filters
  useEffect(() => {
    setFilters((prev: downloadFilters) => ({
      ...prev,
      userId: Number(currentUser.userId),
    }));
  }, []);

  // handle download logs in excel file
  const handleDownload = async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    const { limit, startDate, endDate, ownerId } = filters;

    // validate start date
    if (new Date(String(filters.startDate)).getTime() > new Date().getTime()) {
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: "Invalid start date.",
        })
      );

      return;
    }

    // validate end date
    if (new Date(String(filters.endDate)).getTime() > new Date().getTime()) {
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: "Invalid end date.",
        })
      );

      return;
    }

    // validate limit value
    if (filters.limit && filters.limit > 500) {
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: "The maximum limit value is 500",
        })
      );

      return;
    }

    // proceed to generate reports if the above conditions are fulfilled
    try {
      const response = await fetchData(
        `/download-logs/${Number(
          currentUser.userId
        )}/${startDate}/${endDate}/${limit}/${Number(ownerId)}`
      );

      if (!response || response.status === 404) {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: `ERROR OCCURRED PLEASE TRY AGAIN!!, ${
              response && response.data.message
            }`,
          })
        );

        return;
      }
      window.open(
        `${process.env.REACT_APP_BACKEND_URL}/download-logs/${Number(
          currentUser.userId
        )}/${filters.startDate}/${filters.endDate}/${filters.limit}/${Number(
          ownerId
        )}`,
        "_blank"
      );

      setFilters({
        limit: 500,
        startDate: null,
        endDate: null,
        ownerId: null,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("ERROR DOWNLOADING LOGS: ", error.message);
      }
    }
  };

  return (
    <div
      className={`p-10 filter-form-overlay absolute top-0 left-0 right-0 bottom-0 flex items-center lg:items-start justify-center lg:justify-end  transition-all ease-in delay-150  ${
        !isShowReportFilterForm === false ? "scale-100" : "scale-0"
      } `}
    >
      <form
        className="w-full lg:w-1/3 h-[calc(100vh-100px)] overflow-auto m-auto py-10 rounded-lg relative bg-gray-100"
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
      >
        <button
          className="absolute top-2 right-2 text-2xl lg:hover:bg-red-500 lg:hover:text-white p-2 active:scale-95"
          onClick={() => {
            setIsShowReportFilterForm(false);
            setFilters({
              limit: 500,
              startDate: null,
              endDate: null,
              ownerId: null,
            });
          }}
        >
          <RxCross1 />
        </button>

        <h1 className="w-full p-5 text-center text-4xl font-sans font-bold">
          Activity Logs
        </h1>

        <div className="py-10 w-full ">
          <div className="form-group py-3 w-2/3 m-auto">
            <label htmlFor="startDate" className="w-full text-sm">
              Start date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="w-full outline-none border rounded-lg focus:border-2 focus:border-blue-300"
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group py-3 w-2/3 m-auto">
            <label htmlFor="endDate" className="w-full text-sm">
              End date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="w-full outline-none border rounded-lg focus:border-2 focus:border-blue-300"
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group py-3 w-2/3 m-auto">
            <label htmlFor="limit" className="w-full text-sm">
              Limit
            </label>
            <input
              type="number"
              id="limit"
              name="limit"
              placeholder="Up to 500"
              className="w-full outline-none border rounded-lg focus:border-2 focus:border-blue-300"
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group py-3 w-2/3 m-auto">
            <label htmlFor="ownerId" className="w-full text-sm">
              For specific user
            </label>
            <input
              type="text"
              id="ownerId"
              name="OwnerId"
              className="w-full outline-none border rounded-lg focus:border-2 focus:border-blue-300"
              placeholder="Enter user Number (eg. USR-23)"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  ownerId:
                    e.target.value.trim().length > 4
                      ? Number(e.target.value.slice(4))
                      : null,
                }))
              }
            />
          </div>
        </div>

        <div className="w-full flex justify-center items-center py-5">
          <button
            className="py-2 px-5 text-lg border-2 border-blue-400 text-blue-400 lg:hover:bg-blue-400 lg:hover:text-white active:scale-95 lg:hover:shadow-xl lg:hover:shadow-blue-200 flex items-center justify-center"
            onClick={handleDownload}
          >
            <span className="px-2">
              <FaDownload />
            </span>
            <span>Download report</span>
          </button>
        </div>
      </form>
    </div>
  );
};

LogsFilterForm = React.memo(LogsFilterForm);

export default LogsFilterForm;
