import React, { useCallback, useEffect, useState } from "react";
import { FacilitiesModel } from "../FacilityModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import {
  fetchFacilityHistory,
  getFacilityHistory,
  resetFacilityHistory,
} from "./HistorySlice";
import Preloader from "../../../other/Preloader";
import FacilityHistoryRow from "./FacilityHistoryRow";
import { FaSearch } from "react-icons/fa";
import PaginationButtons from "../../../global/PaginationButtons";
import { HistoryModel } from "./HistoryModel";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { FaDownload } from "react-icons/fa6";
import HistoryFilterForm from "./HistoryFilterForm";
import EmptyList from "../../../global/EmptyList";

interface Props {
  facility: FacilitiesModel;
}
const FacilityHistoryList: React.FC<Props> = ({ facility }) => {
  const [filteredFacilityHistory, setFilteredFaciliyHistory] = useState<
    HistoryModel[]
  >([]);
  const [searchString, setSearchString] = useState<string>("");

  const [isShowReportFilterForm, setIsShowReportFilterForm] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const facilityHistoryState = useSelector(getFacilityHistory);
  const {
    facilityHistory,
    status,
    error,
    totalElements,
    totalPages,
    page,
    size,
  } = facilityHistoryState;

  // fetch facility history
  useEffect(() => {
    dispatch(
      fetchFacilityHistory({
        facilityId: Number(facility.facilityId),
        page: 0,
        size: 20,
      })
    );
  }, [dispatch, facility.facilityId]);

  // filter facility history
  useEffect(() => {
    if (searchString.trim().length < 1) {
      setFilteredFaciliyHistory(facilityHistory);
    } else {
      setFilteredFaciliyHistory(
        facilityHistory.filter((history) => {
          const inDate = new Date(String(history.checkIn)).getDate();
          const inMonth = new Date(String(history.checkIn)).getMonth() + 1;
          const inYear = new Date(String(history.checkIn)).getFullYear();

          const inHistoryDate = inDate + "/" + inMonth + "/" + inYear;

          const tenantNumber = "TNT-" + history.tenant.tenantId;

          return (
            inHistoryDate.toLocaleLowerCase().trim().includes(searchString) ||
            tenantNumber.toLocaleLowerCase().trim().includes(searchString) ||
            (history.accommodation.accommodationNumber &&
              history.accommodation.accommodationNumber
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (history.tenant.user.firstName &&
              history.tenant.user.firstName
                ?.toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (history.tenant.user.lastName &&
              history.tenant.user.lastName
                ?.toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (history.tenant.user.userTelephone &&
              history.tenant.user.userTelephone
                ?.toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (history.tenant.user.userEmail &&
              history.tenant.user.userEmail
                ?.toLocaleLowerCase()
                .trim()
                .includes(searchString))
          );
        })
      );
    }
  }, [facilityHistory, searchString]);

  // handle search facility history
  const handleSearchFacilityHistory = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchString(e.target.value);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-history-by-facility/${Number(facility.facilityId)}/${
          page + 1
        }/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetFacilityHistory(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH HISTORY CANCELLED ", error.message);
      }
      console.error("Error fetching history: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-history-by-facility/${Number(facility.facilityId)}/${
          page - 1
        }/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetFacilityHistory(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH HISTORY CANCELLED ", error.message);
      }
      console.error("Error fetching history: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // conditional rendering depending on error or status
  if (status === "loading") return <Preloader />;
  if (error) return <h1>{error}</h1>;

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-2 lg:mt-0 z-0 ">
      <div className="h-[calc(100vh-140px)] w-full relative bg-gray-200">
        <div className="w-full mb-3">
          <div className="w-full h-1/3 flex flex-wrap justify-between items-center px-2 lg:px-10 py-3">
            <div className="w-full lg:w-1/4"></div>

            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                <button
                  className="transition-all ease-in-out delay-100 text-lg py-1 px-2 lg:px-5 border-2 border-green-600 text-green-600 lg:hover:text-white cursor-pointer lg:hover:bg-green-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => setIsShowReportFilterForm(true)}
                >
                  <span className="pr-2">
                    <FaDownload />
                  </span>
                  <span>Report</span>
                </button>
                <h1 className="text-lg font-bold mr-2">
                  {filteredFacilityHistory.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for history..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchFacilityHistory}
                />

                <button className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5  h-[calc(100vh-300px)] ">
          {filteredFacilityHistory.length > 0 ? (
            <table className="border-2 w-full bg-white mt-2 lg:mt-0 shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-white">
                <tr>
                  <th className="p-2 text-start font-bold">Unit Number</th>
                  <th className="p-2 text-start font-bold">Floor</th>
                  <th className="p-2 text-start font-bold">Tenant Number</th>
                  <th className="p-2 text-start font-bold">Tenant Name</th>
                  <th className="p-2 text-start font-bold">Tenant Telephone</th>
                  <th className="p-2 text-start font-bold">Tenant Email</th>
                  <th className="p-2 text-start font-bold">CheckIn</th>
                  <th className="p-2 text-start font-bold">CheckOut</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilityHistory.map((history, index) => (
                  <FacilityHistoryRow key={index} history={history} />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyList itemName="history" />
          )}
        </div>
        <PaginationButtons
          page={page}
          totalPages={totalPages}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>

      <HistoryFilterForm
        isShowReportFilterForm={isShowReportFilterForm}
        setIsShowReportFilterForm={setIsShowReportFilterForm}
        facilityId={facility.facilityId}
      />
    </div>
  );
};

export default FacilityHistoryList;
