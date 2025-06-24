import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { AppDispatch } from "../../app/store";
import { fetchData } from "../../global/api";

import { FacilitiesModel } from "./FacilityModel";
import { getFacilities, resetFacilities } from "./FacilitiesSlice";
import { FaSearch } from "react-icons/fa";
import FacilitiesTable from "./FacilitiesTable";
import FacilityForm from "./FacilityForm";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { UserModel } from "../users/models/userModel";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";

interface Props {}

const currentUser: UserModel = JSON.parse(
  localStorage.getItem("dnap-user") as string
);

const Facilities: React.FC<Props> = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [filteredFacilities, setFilteredFacilities] = useState<
    FacilitiesModel[]
  >([]);

  const [isAddFacility, setIsAddFacility] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const facilitiesState = useSelector(getFacilities);
  const { facilities, page, size, totalElements, totalPages, status } =
    facilitiesState;

  // toggel Is Add Facility
  const toggelIsAddFacility = () => {
    return setIsAddFacility(!isAddFacility);
  };

  // filter facilities basing on various parameters
  useEffect(() => {
    if (searchString.trim().length === 0) {
      setFilteredFacilities(facilities);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredFacilities(
        facilities.filter((facility) => {
          const {
            facilityId,
            facilityName,
            facilityCategory,
            dateCreated,
            contact: { telephone1, email },
            facilityLocation: { country, city },
          } = facility;

          const facilityNumber = "FAC-" + facilityId;

          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const facilityDateAdded = date + "/" + month + "/" + year;

          return (
            (facilityId && facilityNumber.toLowerCase().includes(searchTerm)) ||
            (facilityName && facilityName.toLowerCase().includes(searchTerm)) ||
            (facilityCategory &&
              facilityCategory.toLowerCase().includes(searchTerm)) ||
            (country && country.toLowerCase().includes(searchTerm)) ||
            (city && city.toLowerCase().includes(searchTerm)) ||
            (telephone1 && telephone1.toLowerCase().includes(searchTerm)) ||
            (email && email.toLowerCase().includes(searchTerm)) ||
            (facilityDateAdded &&
              facilityDateAdded.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, facilities]);

  // on change of the search field
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  }, []);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    let userId: number;

    if (currentUser?.userRole !== UserRoleEnum.landlord) {
      userId = Number(currentUser?.linkedTo);
    } else {
      userId = Number(currentUser.userId);
    }

    try {
      const result = await fetchData(
        `/fetch-facilities-by-landlord/${userId}/${page + 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    let userId: number;

    if (currentUser?.userRole !== UserRoleEnum.landlord) {
      userId = Number(currentUser?.linkedTo);
    } else {
      userId = Number(currentUser.userId);
    }
    try {
      const result = await fetchData(
        `/fetch-facilities-by-landlord/${userId}/${page - 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetFacilities(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ADMINS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0 bg-gray-200 relative">
      <div className="list w-full relative">
        <div className="bg-white w-full mb-5">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-2 lg:px-10 py-3 bg-white shadow-lg">
            {!isAddFacility && (
              <div className="w-full flex flex-wrap justify-end items-center">
                <div className="w-full lg:w-2/3 lx-3 lg:px-10 flex flex-wrap justify-between lg:justify-between items-center">
                  <h1
                    className="transition-all ease-in-out delay-100 text-lg py-1 px-2 lg:px-5 border-2 border-blue-600 text-blue-600 hover:text-white cursor-pointer lg:hover:bg-blue-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                    onClick={toggelIsAddFacility}
                  >
                    <span className="pr-2">
                      <FaPlus />
                    </span>
                    <span>Add Facility</span>
                  </h1>
                  <h1 className="text-xl font-bold text-blue-900 tracking-wider">
                    Facilities
                  </h1>

                  <h1 className="font-bold text-lg  m-2 lg:m-0">
                    {filteredFacilities.length + "/" + totalElements}
                  </h1>
                </div>
                <div
                  className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
                >
                  <input
                    type="text"
                    name=""
                    id="search-users"
                    placeholder="Search for user..."
                    className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                    onChange={handleChange}
                  />
                  <button className="bg-blue-900 hover:bg-blue-600 text-white p-2 rounded-full text-xl text-center border ">
                    {<FaSearch />}
                  </button>
                </div>
              </div>
            )}
          </div>
          {!isAddFacility ? (
            <FacilitiesTable
              filteredFacilities={filteredFacilities}
              page={page}
              totalPages={totalPages}
              handleFetchNextPage={handleFetchNextPage}
              handleFetchPreviousPage={handleFetchPreviousPage}
              status={status}
            />
          ) : (
            <FacilityForm toggelIsAddFacility={toggelIsAddFacility} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
