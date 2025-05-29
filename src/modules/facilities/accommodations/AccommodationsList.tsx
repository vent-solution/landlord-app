import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { fetchData } from "../../../global/api";
import PaginationButtons from "../../../global/PaginationButtons";
import { AccommodationModel } from "./AccommodationModel";
import {
  fetchAccommodationsByFacility,
  getFacilityAccommodations,
  resetFacilityAccommodations,
} from "./accommodationsSlice";
import { FacilitiesModel } from "../FacilityModel";
import Accommodation from "./Accommodation";
import AccommodationDetails from "./AccommodationDetails";
import { ACCOMMODATION_TYPE_DATA } from "../../../global/PreDefinedData/PreDefinedData";
import AccommodationForm from "./AccommodationForm";
import { FaDownload } from "react-icons/fa6";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { setAlert } from "../../../other/alertSlice";
import { UserModel } from "../../users/models/userModel";
import { setUserAction } from "../../../global/actions/actionSlice";
import { setConfirm } from "../../../other/ConfirmSlice";
import EmptyList from "../../../global/EnptyList";

interface Props {
  facility: FacilitiesModel;
}

const Accommodations: React.FC<Props> = ({ facility }) => {
  // local state variabes
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<{
    label: string;
    values: string;
  }>();

  const [searchString, setSearchString] = useState<string>("");
  const [filteredFacilityAccommodations, setFilteredFacilityAccommodations] =
    useState<AccommodationModel[]>([]);

  const [showAccommodationDetails, setShowAccommodationDetails] =
    useState<boolean>(false);
  const [currentAccommodation, setCurrentAccommodation] =
    useState<AccommodationModel>();

  const dispatch = useDispatch<AppDispatch>();
  const accommodationState = useSelector(getFacilityAccommodations);
  const { facilityAccommodations, totalElements, totalPages, page, size } =
    accommodationState;

  // fetch accommodations by facility
  useEffect(() => {
    dispatch(
      fetchAccommodationsByFacility({
        facilityId: Number(facility.facilityId),
        page: 0,
        size: 25,
      })
    );
  }, [dispatch, facility.facilityId]);

  // filter facility accommodation
  useEffect(() => {
    const originalFacilityAccommodations =
      facilityAccommodations.length > 0
        ? [...facilityAccommodations].sort((a, b) => {
            const aAccommodationId = a.accommodationId
              ? parseInt(String(a.accommodationId), 10)
              : 0;
            const bBidId = b.accommodationId
              ? parseInt(String(b.accommodationId), 10)
              : 0;
            return bBidId - aAccommodationId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredFacilityAccommodations(originalFacilityAccommodations);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredFacilityAccommodations(
        originalFacilityAccommodations.filter((facilityAccommodation) => {
          const {
            price,
            accommodationNumber,
            floor,
            dateCreated,
            accommodationType,
            availability,
          } = facilityAccommodation;

          const accommodationYear = new Date(`${dateCreated}`).getFullYear();
          const accommodationMonth = new Date(`${dateCreated}`).getMonth() + 1;
          const accommodationDay = new Date(`${dateCreated}`).getDate();
          const accommodationDate =
            accommodationDay +
            "/" +
            accommodationMonth +
            "/" +
            accommodationYear;
          return (
            (accommodationDate &&
              accommodationDate.toLowerCase().includes(searchTerm)) ||
            (accommodationNumber &&
              accommodationNumber.toLowerCase().includes(searchTerm)) ||
            (floor && floor.toLowerCase().includes(searchTerm)) ||
            (accommodationType &&
              accommodationType.toLowerCase().includes(searchTerm)) ||
            (availability && availability.toLowerCase().includes(searchTerm)) ||
            (price && Number(price) === Number(searchTerm))
          );
        })
      );
    }
  }, [searchString, facilityAccommodations]);

  // handle search event
  const handleSearchAccommodation = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle download accommodations report in excel format
  const handleDownload = async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const response = await fetchData(
        `/download-accommodations/${Number(currentUser.userId)}/${Number(
          facility.facilityId
        )}`
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
        `${process.env.REACT_APP_API_URL}/download-accommodations/${Number(
          currentUser.userId
        )}/${Number(facility.facilityId)}`,
        "_blank"
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("ERROR DOWNLOADING LOGS: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ message: "", status: false }));
    }
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-accommodations-by-facility/${Number(facility.facilityId)}/${
          page + 1
        }/${size}`
      );
      dispatch(resetFacilityAccommodations(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ACCOMMODATIONS CANCELLED ", error.message);
      }
      console.error("Error fetching accommodations: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-accommodations-by-facility/${Number(facility.facilityId)}/${
          page - 1
        }/${size}`
      );
      console.log(result);
      dispatch(resetFacilityAccommodations(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ACCOMMODATIONS CANCELLED ", error.message);
      }
      console.error("Error fetching accommodations: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // show and hide accommodation details
  const toggleShowAccommodationDetails = () => {
    setShowAccommodationDetails(!showAccommodationDetails);
    console.log(showAccommodationDetails);
  };

  // toggle show form on selecting accommodation type
  const handleSelectAccommodationType = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value.trim().length < 1) {
      setShowForm(false);
    } else {
      setSelectedType({
        label: String(
          ACCOMMODATION_TYPE_DATA.find((type) => type.value === e.target.value)
            ?.label
        ),
        values: e.target.value,
      });
      setShowForm(true);
    }
  };

  if (showForm)
    return (
      <AccommodationForm
        setShowForm={setShowForm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        facility={facility}
        toggleShowAccommodationDetails={toggleShowAccommodationDetails}
      />
    );

  if (showAccommodationDetails)
    return (
      <div
        className="lg:px-5 mb-12 overflow-auto pb-5 w-full"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <AccommodationDetails
          accommodation={currentAccommodation}
          setShowForm={setShowForm}
          toggleShowAccommodationDetails={toggleShowAccommodationDetails}
        />
      </div>
    );

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-0 lg:mt-0 z-0">
      {!showAccommodationDetails && (
        <div className="w-full bg-gray-200 relative h-[calc(100vh-110px)]">
          <div className="w-full">
            <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-2 lg:px-10 py-3 mb-5">
              <div className="w-full lg:w-3/4 flex flex-wrap justify-between items-center">
                <div className="w-full lg:w-2/3 flex flex-wrap justify-between lg:justify-around items-center font-bold">
                  <h1
                    className="transition-all ease-in-out delay-100 text-sm lg:text-lg py-1 px-2 lg:px-5 border-2 border-green-600 text-green-600 lg:hover:text-white cursor-pointer lg:hover:bg-green-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                    onClick={() => {
                      dispatch(
                        setConfirm({
                          message:
                            "Continue downloading accommodations report.",
                          status: true,
                        })
                      );
                      dispatch(setUserAction({ userAction: handleDownload }));
                    }}
                  >
                    <span className="px-2">
                      <FaDownload />
                    </span>
                    <span>Report</span>
                  </h1>
                  <select
                    name="addAccommodation"
                    id="addAccommodation"
                    className="bg-blue-500 rounded-lg px-2 lg:px-5 text-white text-sm outline-none border-none lg:hover:bg-blue-400 cursor-pointer w-28 lg:w-fit"
                    onChange={handleSelectAccommodationType}
                  >
                    <option value="">ADD UNIT</option>
                    {ACCOMMODATION_TYPE_DATA.map((type) => (
                      <option value={type.value}>{type.label}</option>
                    ))}
                  </select>

                  <h1 className="text-lg mr-2">
                    {filteredFacilityAccommodations.length +
                      "/" +
                      totalElements}
                  </h1>
                </div>
                <div
                  className={` rounded-full flex justify-between border-blue-900 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
                >
                  <input
                    type="text"
                    name=""
                    id="search-subscription"
                    placeholder="Search for bid..."
                    className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                    onChange={handleSearchAccommodation}
                  />

                  <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                    {<FaSearch />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="lg:px-5 mb-12 overflow-auto pb-5 relative"
            style={{ height: "calc(100vh - 280px)" }}
          >
            {filteredFacilityAccommodations.length > 0 ? (
              <table className="border-2 w-full bg-white shadow-lg">
                <thead className="sticky top-0 bg-blue-900 text-base text-white">
                  <tr>
                    {/* <th className="px-2">#</th> */}
                    {/* <th className="px-2">ID</th> */}
                    <th className="p-2 font-bold text-start">Number</th>
                    <th className="p-2 font-bold text-start">Floor</th>
                    <th className="p-2 font-bold text-start">Type</th>
                    <th className="p-2 font-bold text-start">Capacity</th>
                    <th className="p-2 font-bold text-start">Price</th>
                    <th className="p-2 font-bold text-start">Status</th>
                    {/* <th className="p-2 font-bold text-start">Tenants</th> */}
                    <th className="p-2 font-bold text-start">Created</th>
                    <th className="p-2 font-bold text-start">Updated</th>
                  </tr>
                </thead>
                <tbody className="text-black font-light">
                  {filteredFacilityAccommodations.map(
                    (accommodation: AccommodationModel, index: number) => (
                      <Accommodation
                        key={index}
                        accommodation={accommodation}
                        accommodationIndex={index}
                        facility={facility}
                        onClick={() => {
                          setCurrentAccommodation(accommodation);
                          toggleShowAccommodationDetails();
                          console.log(accommodation);
                        }}
                      />
                    )
                  )}
                </tbody>
              </table>
            ) : (
              <EmptyList itemName="Accommodation" />
            )}
          </div>
          <PaginationButtons
            page={page}
            totalPages={totalPages}
            handleFetchNextPage={handleFetchNextPage}
            handleFetchPreviousPage={handleFetchPreviousPage}
          />
        </div>
      )}
    </div>
  );
};

export default Accommodations;
