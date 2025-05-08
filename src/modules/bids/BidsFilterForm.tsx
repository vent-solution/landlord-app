import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { setAlert } from "../../other/alertSlice";
import { fetchData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { UserModel } from "../users/models/userModel";
import { FaDownload } from "react-icons/fa";
import { downloadFilters } from "../../global/DownloadFiltersModel";
import { getFacilities } from "../facilities/FacilitiesSlice";

interface Props {
  isShowReportFilterForm: boolean;
  setIsShowReportFilterForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const currentUser: UserModel = JSON.parse(
  localStorage.getItem("dnap-user") as string
);

let BidsFilterForm: React.FC<Props> = ({
  isShowReportFilterForm,
  setIsShowReportFilterForm,
}) => {
  const [filters, setFilters] = useState<downloadFilters>({
    limit: 500,
    startDate: null,
    endDate: null,
    facilityId: null,
  });

  const dispatch = useDispatch<AppDispatch>();

  const facilitiesState = useSelector(getFacilities);
  const { facilities } = facilitiesState;

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

    const { limit, startDate, endDate, facilityId } = filters;

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
        `/download-bids/${Number(
          currentUser.userId
        )}/${startDate}/${endDate}/${limit}/${Number(facilityId)}`
      );

      if (!response || response.status === 404) {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: `ERROR OCCURRED PLEASE TRY AGAIN!!, ${
              response.data.message && response.data.message
            }`,
          })
        );

        return;
      }
      window.open(
        `http://localhost:1000/api/download-bids/${Number(
          currentUser.userId
        )}/${startDate}/${endDate}/${limit}/${Number(facilityId)}`,
        "_blank"
      );

      setFilters({
        limit: 500,
        startDate: null,
        endDate: null,
        facilityId: null,
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
              facilityId: null,
            });
          }}
        >
          <RxCross1 />
        </button>

        <h1 className="w-full p-5 text-center text-4xl font-sans font-bold">
          Bids
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
              value={String(filters.startDate) || ""}
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
              value={String(filters.endDate) || ""}
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
              value={filters.limit || ""}
              className="w-full outline-none border rounded-lg focus:border-2 focus:border-blue-300"
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group py-3 w-2/3 m-auto">
            <label htmlFor="ownerId" className="w-full text-sm">
              For specific facility {filters.facilityId}
            </label>

            <select
              name="facilityId"
              id="facilityId"
              value={String(filters.facilityId) || ""}
              className="w-full outline-none border rounded-lg focus:border-2 focus:border-blue-300"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  facilityId: Number(e.target.value),
                }))
              }
            >
              <option value="">SELECT FACILITY</option>
              {facilities.map((facility, index) => (
                <option key={index} value={facility.facilityId} className="">
                  FAC-{facility.facilityId} {facility.facilityName},{" "}
                  {facility.facilityLocation.city}{" "}
                  {facility.facilityLocation.country}
                </option>
              ))}
            </select>
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

BidsFilterForm = React.memo(BidsFilterForm);

export default BidsFilterForm;
