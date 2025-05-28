import axios from "axios";
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { FaDownload } from "react-icons/fa";
import { AppDispatch } from "../../../app/store";
import { fetchData } from "../../../global/api";
import { downloadFilters } from "../../../global/DownloadFiltersModel";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { setAlert } from "../../../other/alertSlice";
import { UserModel } from "../../users/models/userModel";

interface Props {
  isShowReportFilterForm: boolean;
  setIsShowReportFilterForm: React.Dispatch<React.SetStateAction<boolean>>;

  facilityId: number;
}

const currentUser: UserModel = JSON.parse(
  localStorage.getItem("dnap-user") as string
);

let ServiceFeeFilterForm: React.FC<Props> = ({
  isShowReportFilterForm,
  setIsShowReportFilterForm,
  facilityId,
}) => {
  const [filters, setFilters] = useState<downloadFilters>({
    limit: 500,
    startDate: null,
    endDate: null,
    ownerId: null,
  });

  const dispatch = useDispatch<AppDispatch>();

  // handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // handle download facility service fees report in excel file
  const handleDownload = async () => {
    const { startDate, endDate, limit, ownerId } = filters;

    if (!facilityId || facilityId < 1) {
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: `Please select a facility`,
        })
      );

      return;
    }

    // proceed to generate reports if the above conditions are fulfilled
    try {
      const response = await fetchData(
        `/download-service-fees/${Number(
          currentUser.userId
        )}/${startDate}/${endDate}/${Number(limit)}/${Number(
          facilityId
        )}/${Number(ownerId)}`
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
        `${process.env.REACT_APP_API_URL}/download-service-fees/${Number(
          currentUser.userId
        )}/${startDate}/${endDate}/${Number(limit)}/${Number(
          facilityId
        )}/${Number(ownerId)}`,
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
        console.log("ERROR DOWNLOADING TENANTS: ", error.message);
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
          Service fees
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
              value={String(filters.limit) || ""}
              placeholder="Enter limit up to 500"
              className="w-full outline-none border rounded-lg focus:border-2 focus:border-blue-300"
              onChange={handleInputChange}
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

ServiceFeeFilterForm = React.memo(ServiceFeeFilterForm);

export default ServiceFeeFilterForm;
