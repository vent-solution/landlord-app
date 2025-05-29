import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import Preloader from "../../other/Preloader";
import { fetchOffices, getOffices, resetOffices } from "./OfficesSlice";
import { OfficeModel } from "./OfficeModel";
import Office from "./Office";
import OfficeForm from "./OfficeForm";
import { UserModel } from "../users/models/userModel";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { fetchData } from "../../global/api";
import PaginationButtons from "../../global/PaginationButtons";
import { FaDownload, FaPlus } from "react-icons/fa6";
import { CgDanger } from "react-icons/cg";
import EmptyList from "../../global/EnptyList";

interface Props {}
const OfficesList: React.FC<Props> = () => {
  // local state variabes
  const [searchString, setSearchString] = useState<string>("");
  const [filteredOffices, setFilteredOffices] = useState<OfficeModel[]>([]);
  const [showOfficeForm, setShowOfficeForm] = useState<boolean>(false);

  const officesState = useSelector(getOffices);
  const { offices, status, error, page, size, totalElements, totalPages } =
    officesState;

  const toggleShowOfficeForm = useCallback(() => {
    setShowOfficeForm(!showOfficeForm);
  }, [showOfficeForm]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const originalOffices =
      offices.length > 0
        ? [...offices].sort((a, b) => {
            const aOfficeId = a.officeId ? parseInt(a.officeId, 10) : 0;
            const bOfficeId = b.officeId ? parseInt(b.officeId, 10) : 0;
            return bOfficeId - aOfficeId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredOffices(originalOffices);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredOffices(
        originalOffices.filter((office) => {
          const { officeLocation, officeContact, dateCreated } = office;

          const officeNumber = "OFF-" + office.officeId;

          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const officeDateCreated = date + "/" + month + "/" + year;

          return (
            (officeNumber && officeNumber.toLowerCase().includes(searchTerm)) ||
            (officeLocation.country &&
              officeLocation.country.toLowerCase().includes(searchTerm)) ||
            (officeLocation.city &&
              officeLocation.city.toLowerCase().includes(searchTerm)) ||
            (officeLocation.state &&
              officeLocation.state.toLowerCase().includes(searchTerm)) ||
            (officeLocation.street &&
              officeLocation.street.toLowerCase().includes(searchTerm)) ||
            (officeContact.email &&
              officeContact.email.toLowerCase().includes(searchTerm)) ||
            (officeContact.telephone1 &&
              officeContact.telephone1.toLowerCase().includes(searchTerm)) ||
            (officeContact.telephone2 &&
              officeContact.telephone2.toLowerCase().includes(searchTerm)) ||
            (officeDateCreated &&
              officeDateCreated.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, offices]);

  useEffect(() => {
    const storedUser = localStorage.getItem("dnap-user");
    if (storedUser) {
      try {
        const currentUser: UserModel = JSON.parse(storedUser);
        if (currentUser && currentUser.userId) {
          dispatch(
            fetchOffices({
              owner_id: Number(currentUser.userId),
              page: 0,
              size: 20,
            })
          );
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [dispatch]);

  // handle search event
  const handleSerchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    const owner_id: number = Number(
      JSON.parse(localStorage.getItem("dnap-user") as string).userId
    );
    try {
      const result = await fetchData(
        `/fetch-offices/${Number(owner_id)}/${Number(page) + 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetOffices(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    const owner_id: number = Number(
      JSON.parse(localStorage.getItem("dnap-user") as string).userId
    );
    try {
      const result = await fetchData(
        `/fetch-offices/${Number(owner_id)}/${Number(page) - 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetOffices(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ADMINS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0">
      <div
        className={`form py-10 flex flex-wrap items-center absolute text-teal-50 transition-all ease-linear delay-75 h-full bg-slate-700 ${
          showOfficeForm ? "w-full md:w-full lg:w-1/2" : "overflow-hidden"
        } `}
      >
        <OfficeForm toggleShowOfficeForm={toggleShowOfficeForm} />
      </div>
      <div className="list w-full relative bg-gray-100">
        <div className="bg-white w-full mb-5 shadow-lg">
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-2 lg:px-10 py-3 bg-white">
            <div className="w-full flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                {/* <h1
                  className="transition-all ease-in-out delay-100 text-lg py-1 p-5 border-2 border-green-600 text-green-600 lg:hover:text-white cursor-pointer lg:hover:bg-green-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => {}}
                >
                  <span className="px-2">
                    <FaDownload />
                  </span>
                  <span>Download offices</span>
                </h1> */}

                <button
                  className="transition-all ease-in-out delay-100 py-1 pr-1 lg:px-2 border-2 border-blue-600 text-blue-600 lg:hover:text-white cursor-pointer lg:hover:bg-blue-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => toggleShowOfficeForm()}
                >
                  <span className="px-1">
                    <FaPlus />
                  </span>
                  <span>Add office</span>
                </button>

                <h1 className="text-xl text-blue-900">Our offices</h1>

                <h1 className="font-bold mr-2 lg:mr-0">
                  {filteredOffices.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for subscription..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSerchUser}
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:px-5 mb-12 overflow-auto pb-5 relative mt-1"
          style={{ height: "calc(100vh - 190px)" }}
        >
          {filteredOffices.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-white">
                <tr>
                  {/* <th className="text-start px-2">#</th> */}
                  <th className="text-start px-2">Office number</th>
                  <th className="text-start px-2">Country</th>
                  <th className="text-start px-2">City</th>
                  <th className="text-start px-2">Street</th>
                  <th className="text-start px-2">Email</th>
                  <th className="text-start px-2">Telephone</th>
                  <th className="text-start px-2">Telephone 2</th>
                  <th className="text-start px-2">Date added</th>
                  <th className="text-start px-2">Last updated</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredOffices.map((office: OfficeModel, index: number) => (
                  <Office key={index} office={office} officeIndex={index} />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyList itemName="Office" />
          )}
        </div>
        <PaginationButtons
          page={page}
          totalPages={totalPages}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>
    </div>
  );
};

export default OfficesList;
