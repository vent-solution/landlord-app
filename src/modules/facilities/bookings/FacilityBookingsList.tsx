import React, { useCallback, useEffect, useState } from "react";
import { FacilitiesModel } from "../FacilityModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import {
  fetchFacilityBookings,
  getFacilityBookings,
  resetFacilityBookings,
} from "./bookingsSlice";
import FacilityBookingRow from "./FacilityBookingRow";
import { BookingModel } from "./BookingModel";
import { FaPlus, FaSearch } from "react-icons/fa";
import PaginationButtons from "../../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../../global/api";
import Preloader from "../../../other/Preloader";
import { FaDownload } from "react-icons/fa6";
import BookingFilterForm from "./BookingFilterForm";
import BookingForm from "./BookingForm";

interface Props {
  facility: FacilitiesModel;
}

let FacilityBookingsList: React.FC<Props> = ({ facility }) => {
  const [filteredBookings, setFilteredBookings] = useState<BookingModel[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const [isShowReportFilterForm, setIsShowReportFilterForm] = useState(false);

  const [isShowBookingForm, setIsShowBookingForm] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const facilityBookingsState = useSelector(getFacilityBookings);
  const {
    facilityBookings,
    page,
    size,
    totalElements,
    totalPages,
    status,
    error,
  } = facilityBookingsState;

  // fetch facility bookings
  useEffect(() => {
    dispatch(
      fetchFacilityBookings({
        facilityId: Number(facility.facilityId),
        page: 0,
        size: 18,
      })
    );
  }, [facility.facilityId, dispatch]);

  // filter facility bookings
  useEffect(() => {
    const originalBookings: BookingModel[] = facilityBookings;
    if (searchString.trim().length < 1) {
      setFilteredBookings(originalBookings);
    } else {
      setFilteredBookings(
        originalBookings.filter((booking) => {
          const tenantNumber: string = "TNT-" + booking.tenant.tenantId;
          const date = new Date(String(booking.dateCreated)).getDate();
          const month = new Date(String(booking.dateCreated)).getMonth() + 1;
          const year = new Date(String(booking.dateCreated)).getFullYear();

          const bookingDate = date + "/" + month + "/" + year;

          const { amount, paymentType, tenant, accommodation, checkIn } =
            booking;

          return (
            tenantNumber.toLocaleLowerCase().trim().includes(searchString) ||
            bookingDate.toLocaleLowerCase().trim().includes(searchString) ||
            (tenant.user.firstName &&
              tenant.user.firstName
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            accommodation.accommodationNumber
              .toString()
              .trim()
              .includes(searchString) ||
            (tenant.user.lastName &&
              tenant.user.lastName
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (tenant.user.userEmail &&
              tenant.user.userEmail
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (tenant.companyName &&
              tenant.companyName
                .toLocaleLowerCase()
                .trim()
                .includes(searchString)) ||
            (checkIn &&
              checkIn.toLocaleLowerCase().trim().includes(searchString)) ||
            (paymentType &&
              paymentType.toLocaleLowerCase().trim().includes(searchString)) ||
            Number(amount) === Number(searchString)
          );
        })
      );
    }
  }, [facilityBookings, searchString]);

  // handle search for booking
  const handleSearchBooking = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-bookings-by-facility/${Number(facility.facilityId)}/${
          page + 1
        }/${size}`
      );
      dispatch(resetFacilityBookings(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-bookings-by-facility/${Number(facility.facilityId)}/${
          page - 1
        }/${size}`
      );
      console.log(result);
      dispatch(resetFacilityBookings(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  if (isShowBookingForm)
    return (
      <BookingForm
        setIsShowBookingForm={setIsShowBookingForm}
        facility={facility}
      />
    );

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-2 lg:mt-0 z-0 bg-gray-200">
      <div className="list w-full h-[calc(100vh-140px)] relative ">
        <div className="w-full mb-5 ">
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-2 lg:px-10 py-3">
            <div className="w-full lg:w-full flex flex-wrap justify-between items-center">
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

                <button
                  className="transition-all ease-in-out delay-100 text-lg py-1 px-2 lg:px-5 border-2 border-blue-600 text-blue-600 lg:hover:text-white cursor-pointer lg:hover:bg-blue-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => setIsShowBookingForm(true)}
                >
                  <span className="pr-2">
                    <FaPlus />
                  </span>
                  <span>Add</span>
                </button>
                <h1 className="text-lg font-bold mr-2">
                  {facilityBookings.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for booking..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchBooking}
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5  overflow-auto h-[calc(100vh-310px)]">
          {filteredBookings.length > 0 ? (
            <table className="border-2 w-full bg-white text-center">
              <thead className="sticky top-0 bg-blue-900 text-white">
                <tr>
                  {/* <th className="px-2">No.</th> */}
                  <th className="p-2 text-start font-bold">Unit Number</th>
                  <th className="p-2 text-start font-bold">Unit type</th>
                  <th className="p-2 text-start font-bold">Tenant number</th>
                  <th className="p-2 text-start font-bold">Tenant name</th>
                  <th className="p-2 text-start font-bold">Tenant Telephone</th>
                  <th className="p-2 text-start font-bold">Tenant Email</th>
                  <th className="p-2 text-start font-bold">Amount</th>
                  <th className="p-2 text-start font-bold">Payment type</th>
                  <th className="p-2 text-start font-bold">Check In</th>
                  <th className="p-2 text-start font-bold">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <FacilityBookingRow key={index} booking={booking} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-full flex justify-center items-center">
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

      <BookingFilterForm
        isShowReportFilterForm={isShowReportFilterForm}
        setIsShowReportFilterForm={setIsShowReportFilterForm}
        facilityId={facility.facilityId}
      />
    </div>
  );
};

FacilityBookingsList = React.memo(FacilityBookingsList);

export default FacilityBookingsList;
