import React, { useCallback, useEffect, useState } from "react";
import SideBar from "../../sidebar/sideBar";
import Preloader from "../../other/Preloader";
import { UserModel } from "../users/models/userModel";
import { useDispatch, useSelector } from "react-redux";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { fetchFacilities, getFacilities } from "../facilities/FacilitiesSlice";
import { AppDispatch } from "../../app/store";
import {
  FACILITY_CATEGORY_DATA,
  FACILITY_RATING,
} from "../../global/PreDefinedData/PreDefinedData";
import Select from "react-select";
import countriesList from "../../other/countriesList.json";
import { FacilitiesModel } from "../facilities/FacilityModel";
import {
  getOtherFacilities,
  resetOtherFacilities,
} from "./otherFacilitiesSlice";
import PaginationButtons from "../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { setAlert } from "../../other/alertSlice";
import FacilityBidForm from "../facilities/bids/FacilityBidForm";

interface Props {}

const Dashboard: React.FC<Props> = () => {
  const [filteredFacilities, setFilteredFacilities] = useState<
    FacilitiesModel[]
  >([]);

  const [filteredOtherFacilities, setFilteredOtherFacilities] = useState<
    FacilitiesModel[]
  >([]);

  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [marketFilter, setMarketFilter] = useState<{
    facilityCategory: string;
    country: string;
    city: string;
  }>({ facilityCategory: "", country: "", city: "" });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [selectedFacility, setSelectedFacility] = useState<any>();

  const [isShowBidForm, setIsShowBidForm] = useState(false);

  const facilitiesState = useSelector(getFacilities);
  const { facilities } = facilitiesState;

  const otherFacilitiesState = useSelector(getOtherFacilities);
  const { otherFacilities, page, totalPages, size } = otherFacilitiesState;

  // Handle the change of selected country
  const handleCountryChange = (
    selectedOption: { label: string; value: string } | null
  ) => {
    setMarketFilter((prev) => ({
      ...prev,
      country: String(selectedOption?.value),
    }));
    setSelectedCountry(selectedOption);
  };

  // check if the user is authenticated
  useEffect(() => {
    const current_user: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    if (current_user) {
      setIsAuthenticated(true);
    } else {
      window.location.href = "/";
    }
  }, []);
  const dispatch = useDispatch<AppDispatch>();

  // fetch facilities that belong to the current landlord
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    let userId = null;

    if (currentUser?.userRole !== UserRoleEnum.landlord) {
      userId = Number(currentUser?.linkedTo);
    } else {
      userId = Number(currentUser.userId);
    }

    dispatch(
      fetchFacilities({
        userId: Number(userId),
        page: 0,
        size: 25,
      })
    );
  }, [dispatch]);

  //filter facilities on the market

  useEffect(() => {
    const other_facilities = otherFacilities.filter(
      (fac) => !facilities.map((ff) => ff.facilityId).includes(fac.facilityId)
    );

    if (
      !marketFilter.facilityCategory &&
      !marketFilter.country &&
      !marketFilter.city
    ) {
      setFilteredFacilities(facilities);
      setFilteredOtherFacilities(other_facilities);
      return;
    }

    const filtered = facilities.filter(
      (facility) =>
        (!marketFilter.facilityCategory ||
          facility.facilityCategory.toLowerCase() ===
            marketFilter.facilityCategory.toLocaleLowerCase()) &&
        (!marketFilter.country ||
          facility.facilityLocation.country
            .toLowerCase()
            .includes(marketFilter.country.toLocaleLowerCase())) &&
        (!marketFilter.city ||
          facility.facilityLocation.city
            .toLowerCase()
            .includes(marketFilter.city.toLocaleLowerCase()))
    );

    const filteredOther = otherFacilities
      .filter(
        (facility) =>
          (!marketFilter.facilityCategory ||
            facility.facilityCategory.toLowerCase() ===
              marketFilter.facilityCategory.toLocaleLowerCase()) &&
          (!marketFilter.country ||
            facility.facilityLocation.country
              .toLowerCase()
              .includes(marketFilter.country.toLocaleLowerCase())) &&
          (!marketFilter.city ||
            facility.facilityLocation.city
              .toLowerCase()
              .includes(marketFilter.city.toLocaleLowerCase()))
      )
      .filter(
        (fac) => !facilities.map((ff) => ff.facilityId).includes(fac.facilityId)
      );

    setFilteredFacilities(filtered);
    setFilteredOtherFacilities(filteredOther);
  }, [facilities, otherFacilities, marketFilter]);

  // useEffect(() => {
  //   const other_facilities = otherFacilities.filter(
  //     (fac) => !facilities.map((ff) => ff.facilityId).includes(fac.facilityId)
  //   );

  //   if (
  //     !marketFilter.facilityCategory &&
  //     !marketFilter.country &&
  //     !marketFilter.city
  //   ) {
  //     setFilteredFacilities(facilities);
  //     setFilteredOtherFacilities(other_facilities);
  //     return;
  //   }

  //   if (
  //     marketFilter.facilityCategory.trim().length > 0 &&
  //     marketFilter.country.trim().length <= 0 &&
  //     marketFilter.city.trim().length <= 0
  //   ) {
  //     setFilteredFacilities(
  //       facilities.filter(
  //         (facility) =>
  //           facility.facilityCategory.toLowerCase() ===
  //           marketFilter.facilityCategory.toLocaleLowerCase()
  //       )
  //     );

  //     setFilteredOtherFacilities(
  //       otherFacilities
  //         .filter(
  //           (facility) =>
  //             facility.facilityCategory.toLowerCase() ===
  //             marketFilter.facilityCategory.toLocaleLowerCase()
  //         )
  //         .filter(
  //           (fac) =>
  //             !facilities.map((ff) => ff.facilityId).includes(fac.facilityId)
  //         )
  //     );
  //   }

  //   if (
  //     marketFilter.country.trim().length > 0 &&
  //     marketFilter.city.trim().length <= 0
  //   ) {
  //     setFilteredFacilities(
  //       facilities.filter(
  //         (facility) =>
  //           facility.facilityCategory.toLowerCase() ===
  //             marketFilter.facilityCategory.toLocaleLowerCase() &&
  //           facility.facilityLocation.country
  //             .toLowerCase()
  //             .includes(marketFilter.country.toLocaleLowerCase())
  //       )
  //     );

  //     setFilteredOtherFacilities(
  //       otherFacilities
  //         .filter(
  //           (facility) =>
  //             facility.facilityCategory.toLowerCase() ===
  //               marketFilter.facilityCategory.toLocaleLowerCase() &&
  //             facility.facilityLocation.country
  //               .toLowerCase()
  //               .includes(marketFilter.country.toLocaleLowerCase())
  //         )
  //         .filter(
  //           (fac) =>
  //             !facilities.map((ff) => ff.facilityId).includes(fac.facilityId)
  //         )
  //     );
  //   }

  //   if (marketFilter.city.trim().length > 0) {
  //     setFilteredFacilities(
  //       facilities.filter(
  //         (facility) =>
  //           facility.facilityCategory.toLowerCase() ===
  //             marketFilter.facilityCategory.toLocaleLowerCase() &&
  //           facility.facilityLocation.country
  //             .toLowerCase()
  //             .includes(marketFilter.country.toLocaleLowerCase()) &&
  //           facility.facilityLocation.city
  //             .toLowerCase()
  //             .includes(marketFilter.city.toLocaleLowerCase())
  //       )
  //     );

  //     setFilteredOtherFacilities(
  //       otherFacilities
  //         .filter(
  //           (facility) =>
  //             facility.facilityCategory.toLowerCase() ===
  //               marketFilter.facilityCategory.toLocaleLowerCase() &&
  //             facility.facilityLocation.country
  //               .toLowerCase()
  //               .includes(marketFilter.country.toLocaleLowerCase()) &&
  //             facility.facilityLocation.city
  //               .toLowerCase()
  //               .includes(marketFilter.city.toLocaleLowerCase())
  //         )
  //         .filter(
  //           (fac) =>
  //             !facilities.map((ff) => ff.facilityId).includes(fac.facilityId)
  //         )
  //     );
  //   }
  // }, [
  //   facilities,
  //   otherFacilities,
  //   marketFilter.city,
  //   marketFilter.country,
  //   marketFilter.facilityCategory,
  //   filteredFacilities,
  //   filteredOtherFacilities,
  // ]);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetch-facilities/${page + 1}/${size}`);
      console.log(result.data);
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );

        return;
      }
      dispatch(resetOtherFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(`/fetch-facilities/${page - 1}/${size}`);

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );

        return;
      }
      dispatch(resetOtherFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size]);

  if (!isAuthenticated) return <Preloader />;

  return (
    <div className="main flex relative w-full">
      <div className="left lg:w-1/4 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar />
      </div>
      <div
        className="right lg:w-full w-full h-svh px-0 lg:px-0 py-0 overflow-y-auto  mt-0 lg:mt-0"
        // style={{ height: "calc(100vh - 10px)" }}
      >
        {isShowBidForm ? (
          <FacilityBidForm
            setIsShowBidForm={setIsShowBidForm}
            facility={selectedFacility}
          />
        ) : (
          <div className="flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0 bg-gray-100">
            <div className="list w-full relative">
              <div className="bg-white w-full pt-3 lg:pt-0">
                <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-1 bg-white shadow-lg mb-3">
                  <div className="w-full lg:w-full flex flex-wrap justify-between items-center">
                    <div
                      className={` rounded-full  bg-white flex flex-wrap justify-around items-center  w-full lg:w-full h-3/4 mt-0 lg:mt-0 `}
                    >
                      <div className="w-full lg:w-1/4 text-lg capitalize px-5">
                        <select
                          name=""
                          id="facilityCategory"
                          className={`rounded-lg border w-full p-2 outline-none transition-all ease-in-out delay-150`}
                          onChange={(e) =>
                            setMarketFilter((prev) => ({
                              ...prev,
                              facilityCategory: String(e.target.value),
                            }))
                          }
                        >
                          <option value={""}>FACILITY CATEGORY</option>
                          {FACILITY_CATEGORY_DATA.map((category) => (
                            <option value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full lg:w-1/4 text-lg capitalize px-5 py-2">
                        <Select
                          isDisabled={!marketFilter.facilityCategory}
                          value={selectedCountry} // Currently selected country
                          onChange={(e) => {
                            handleCountryChange(e);
                            setMarketFilter((prev) => ({
                              ...prev,
                              country: String(e?.label),
                            }));
                          }} // Change handler
                          options={countriesList} // Array of country options
                          placeholder="COUNTRY"
                          isSearchable={true}
                        />
                      </div>

                      <div className="w-full lg:w-1/4 text-lg capitalize px-5 py-2">
                        <input
                          type="text"
                          name=""
                          disabled={!marketFilter.country}
                          id="search-subscription"
                          placeholder="City/municipality/district"
                          className={`rounded-lg w-full p-2 outline-none border transition-all ease-in-out delay-150`}
                          onChange={(e) =>
                            setMarketFilter((prev) => ({
                              ...prev,
                              city: String(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:px-5 mb-12 overflow-auto pb-5 h-[calc(100svh-150px)] relative">
                <div className="w-full lg:w-2/3 p-2 bg-white m-auto flex flex-wrap">
                  <div className="w-full flex justify-around items-center sticky top-0 bg-white py-5 font-bold">
                    <h1 className="w-1/3 text-2xl text-center text-gray-600">
                      Our facilities
                    </h1>
                    <h1 className="text-3xl bg-blue-900 p-3 text-white rounded-full">
                      VS
                    </h1>
                    <h1 className="w-1/3 text-2xl text-center text-gray-400">
                      Other facilities
                    </h1>
                  </div>

                  {/* our facilities */}
                  <div className="w-1/2 p-2 lg:px-5 border">
                    {[...filteredFacilities]
                      .sort((a, b) => Number(b.bidAmount) - Number(a.bidAmount))
                      .map((facility, index) => (
                        <div className="w-full p-2 lg:p-5 m-auto text-start lg:text-center lg:hover:bg-blue-100">
                          <div
                            key={index}
                            className="py-5 w-full overflow-auto"
                          >
                            <span className="font-bold text-sm px-3 py-1 bg-gray-500 text-white rounded-full">
                              {index + 1}
                            </span>

                            <h2 className="text-sm font-bold text-gray-600 mt-1">
                              {
                                FACILITY_RATING.find(
                                  (rate) =>
                                    rate.value === facility.facilityRating
                                )?.label
                              }
                            </h2>

                            <h1 className="text-lg font-bold text-gray-600">
                              {facility.facilityName}
                            </h1>

                            <h1 className="text-sm">
                              {facility.facilityLocation.city +
                                " " +
                                facility.facilityLocation.country}
                            </h1>

                            <h2 className="text-xs text-gray-600">
                              {
                                FACILITY_CATEGORY_DATA.find(
                                  (category) =>
                                    category.value === facility.facilityCategory
                                )?.label
                              }
                            </h2>

                            {facility.bidAmount && (
                              <h2 className="text-sm font-bold text-green-600">
                                USD. {facility.bidAmount}
                              </h2>
                            )}
                          </div>
                          <button
                            className="px-5 text-sm text-blue-400 border-2 border-blue-400 rounded-lg lg:hover:bg-blue-500 lg:hover:text-white "
                            onClick={() => {
                              setSelectedFacility(facility);
                              setIsShowBidForm(true);
                            }}
                          >
                            bid
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* other facilities */}
                  <div className="w-1/2 p-2 lg:px-5 border">
                    {filteredOtherFacilities.map((facility, index) => (
                      <div
                        key={index}
                        className="py-5 w-full overflow-auto lg:hover:bg-blue-100"
                      >
                        <div className="w-fit m-auto text-start lg:text-center">
                          <span className="font-bold text-xs px-3 py-1 bg-gray-400 text-white rounded-full w-10 h-10">
                            {index + 1}
                          </span>

                          <h2 className="text-sm font-bold text-gray-600 mt-1">
                            {
                              FACILITY_RATING.find(
                                (rate) => rate.value === facility.facilityRating
                              )?.label
                            }
                          </h2>

                          <h1 className="text-lg font-bold text-gray-400">
                            {facility.facilityName}
                          </h1>

                          <h1 className="text-sm">
                            {facility.facilityLocation.city +
                              " " +
                              facility.facilityLocation.country}
                          </h1>

                          <h2 className="text-xs text-gray-600">
                            {
                              FACILITY_CATEGORY_DATA.find(
                                (category) =>
                                  category.value === facility.facilityCategory
                              )?.label
                            }
                          </h2>

                          {facility.bidAmount && (
                            <h2 className="text-sm font-bold text-green-600">
                              USD. {facility.bidAmount}
                            </h2>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <PaginationButtons
                page={page}
                totalPages={totalPages}
                handleFetchNextPage={handleFetchNextPage}
                handleFetchPreviousPage={handleFetchPreviousPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
