import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFacilityServiceFees,
  resetFacilityServiceFees,
} from "./FacilityServiceFeesSlice";
import FacilityServiceFeeRow from "./FacilityServiceFeeRow";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { fetchData } from "../../../global/api";
import Preloader from "../../../other/Preloader";
import { FacilitiesModel } from "../FacilityModel";
import { AppDispatch } from "../../../app/store";
import PaginationButtons from "../../../global/PaginationButtons";
import { ServiceFeeModel } from "../../serviceFees/ServiceFeeModel";
import FacilityServiceFeeForm from "./FacilityServiceFeeForm";
import ServiceFeeFilterForm from "./ServiceFeeFilterForm";
import { FaDownload } from "react-icons/fa6";

interface Props {
  facility: FacilitiesModel;
}
let FacilityServiceFeesList: React.FC<Props> = ({ facility }) => {
  const [fiteredFacilityServiceFees, setFilteredFacilityServiceFees] = useState<
    ServiceFeeModel[]
  >([]);

  const [searchString, setSearchString] = useState<string>("");

  const [isShowServiceFeeForm, setIsShowServiceFeeForm] =
    useState<boolean>(false);

  const [isShowReportFilterForm, setIsShowReportFilterForm] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const facilityServiceFeesState = useSelector(getFacilityServiceFees);
  const {
    facilityServiceFees,
    page,
    totalElements,
    size,
    totalPages,
    status,
    error,
  } = facilityServiceFeesState;

  // filter facility service fees
  useEffect(() => {
    const searchTerm: string = searchString;
    const originalFacilityServiceFees: ServiceFeeModel[] = facilityServiceFees;

    if (searchTerm.trim().length < 1) {
      setFilteredFacilityServiceFees(originalFacilityServiceFees);
    } else {
      setFilteredFacilityServiceFees(
        originalFacilityServiceFees.filter((serviceFee) => {
          const { amount, dateCreated, paymentType, paidBy } = serviceFee;
          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const serviceFeeDate = date + "/" + month + "/" + year;
          const userNumber = "USR-" + paidBy.userId;

          return (
            Number(amount) === Number(searchTerm) ||
            serviceFeeDate.toLocaleLowerCase().includes(searchTerm) ||
            paymentType.toLocaleLowerCase().includes(searchTerm) ||
            userNumber.toLocaleLowerCase().includes(searchTerm) ||
            paidBy.firstName?.toLocaleLowerCase().includes(searchTerm) ||
            paidBy.lastName?.toLocaleLowerCase().includes(searchTerm) ||
            paidBy.userTelephone?.toLocaleLowerCase().includes(searchTerm) ||
            paidBy.userEmail?.toLocaleLowerCase().includes(searchTerm)
          );
        })
      );
    }
  }, [facilityServiceFees, searchString]);

  // handle search facility  service fee
  const handleSearchFacilityServiceFee = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value),
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-service-fees-by-facility/${Number(facility.facilityId)}/${
          page + 1
        }/${size}`
      );
      dispatch(resetFacilityServiceFees(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-service-fees-by-facility/${Number(facility.facilityId)}/${
          page - 1
        }/${size}`
      );
      dispatch(resetFacilityServiceFees(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  if (status === "loading") return <Preloader />;

  if (status === "failed") return <p>Error loading service fees: {error}</p>;

  if (isShowServiceFeeForm)
    return (
      <FacilityServiceFeeForm
        facility={facility}
        setIsShowServiceFeeForm={setIsShowServiceFeeForm}
      />
    );

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-2 lg:mt-0 z-0 bg-gray-200">
      <div className="list w-full h-[calc(100vh-140px)] relative ">
        <div className="w-full mb-5 ">
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-5 lg:px-10 py-3">
            <div className="w-full lg:w-full flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex flex-wrap justify-between lg:justify-around items-center">
                <button
                  className="transition-all ease-in-out delay-100 text-lg py-1 p-5 border-2 border-green-600 text-green-600 lg:hover:text-white cursor-pointer lg:hover:bg-green-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => setIsShowReportFilterForm(true)}
                >
                  <span className="px-2">
                    <FaDownload />
                  </span>
                  <span>Service fees report</span>
                </button>
                <h1
                  className="text-sm py-1 px-5 bg-blue-700 text-white lg:hover:bg-blue-400 cursor-pointer"
                  onClick={() => setIsShowServiceFeeForm(true)}
                >
                  Pay service fee
                </h1>
              </div>
              <div className="w-1/2 lg:w-fit flex justify-between lg:justify-around items-center font-bold">
                <h1 className="text-lg">
                  {fiteredFacilityServiceFees.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-facility-service-fee"
                  placeholder="Search for service fee..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchFacilityServiceFee}
                />
                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5 mt-1 h-[calc(100vh-310px)]">
          {fiteredFacilityServiceFees.length > 0 ? (
            <table className="border-2 w-full m-auto bg-white bordered text-center shadow-lg">
              <thead className="bg-blue-900 text-white sticky top-0">
                <tr className="text-sm">
                  <th>#</th>
                  <th>Amount</th>
                  <th>Payment type</th>
                  <th>Date</th>
                  <th>Added by</th>
                  <th>Name</th>
                  <th>Telephone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {fiteredFacilityServiceFees.map((serviceFee, index) => (
                  <FacilityServiceFeeRow
                    key={index}
                    serviceFee={serviceFee}
                    serviceFeeIndex={index}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-5/6 flex justify-center items-center">
              <div
                className="w-14 lg:w-20 h-14 lg:h-20"
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
      </div>
      <ServiceFeeFilterForm
        isShowReportFilterForm={isShowReportFilterForm}
        setIsShowReportFilterForm={setIsShowReportFilterForm}
        facilityId={Number(facility.facilityId)}
      />
    </div>
  );
};

FacilityServiceFeesList = React.memo(FacilityServiceFeesList);
export default FacilityServiceFeesList;
