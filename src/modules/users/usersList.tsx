import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import User from "./user";
import { UserModel } from "./models/userModel";
import { fetchUsers, getAllUsers, resetUsers } from "./usersSlice";
import { FaSearch } from "react-icons/fa";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import Preloader from "../../other/Preloader";
import { AppDispatch } from "../../app/store";
import axios from "axios";
import { fetchData } from "../../global/api";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import PaginationButtons from "../../global/PaginationButtons";
import AddUserForm from "./addUserForm";
import { FaPlus } from "react-icons/fa6";
import EmptyList from "../../global/EnptyList";

interface Props {
  currentUser: UserModel | null;
}
const UserList: React.FC<Props> = ({ currentUser }) => {
  // local state variabes
  const [isShowSearch, setIsShowSearch] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<UserModel[]>([]);
  const [isShowForm, setIsShowForm] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const usersState = useSelector(getAllUsers);
  const {
    landlordUsers,
    status,
    error,
    page,
    size,
    totalElements,
    totalPages,
  } = usersState;

  // toggle show form
  const toggleShowForm = useCallback(() => {
    setIsShowForm(!isShowForm);
  }, [isShowForm]);

  // fetch all the landlord users
  useEffect(() => {
    dispatch(
      fetchUsers({ userId: Number(currentUser?.userId), page: 0, size: 10 })
    );
  }, [currentUser?.userId, dispatch]);

  // filter users depending on search parameters
  useEffect(() => {
    const originalUsers =
      landlordUsers.length > 0
        ? [...landlordUsers]
            .sort((a, b) => {
              const aUserId = a.userId ? parseInt(a.userId, 10) : 0;
              const bUserId = b.userId ? parseInt(b.userId, 10) : 0;
              return bUserId - aUserId;
            })
            .filter(
              (u) =>
                Number(u.userId) !== Number(currentUser?.userId) &&
                u.userRole !== UserRoleEnum.landlord
            )
        : [];
    if (searchString.trim().length === 0) {
      setFilteredUsers(originalUsers);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredUsers(
        originalUsers.filter((user) => {
          const {
            userId,
            firstName,
            lastName,
            gender,
            userEmail,
            userTelephone,
            userRole,
            createdDate,
          } = user;

          const userNumber = "USR-" + userId;
          const date = new Date(String(createdDate)).getDate();
          const month = new Date(String(createdDate)).getMonth() + 1;
          const year = new Date(String(createdDate)).getFullYear();

          const accountCreated = date + "/" + month + "/" + year;

          return (
            (userNumber && userNumber.toLowerCase().includes(searchTerm)) ||
            (firstName && firstName.toLowerCase().includes(searchTerm)) ||
            (lastName && lastName.toLowerCase().includes(searchTerm)) ||
            (gender && gender.toLowerCase().includes(searchTerm)) ||
            (userEmail && userEmail.toLowerCase().includes(searchTerm)) ||
            (userTelephone &&
              userTelephone.toLowerCase().includes(searchTerm)) ||
            (accountCreated &&
              accountCreated.toLowerCase().includes(searchTerm)) ||
            (userRole && userRole.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, landlordUsers, currentUser?.userId]);

  // handle search event
  const handleSerchUser = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-users-by-landlord/${Number(currentUser?.userId)}/${
          page + 1
        }/${size}`
      );
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
      dispatch(resetUsers(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size, currentUser?.userId]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-users-by-landlord/${Number(currentUser?.userId)}/${
          page - 1
        }/${size}`
      );

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
      dispatch(resetUsers(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size, currentUser?.userId]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{"error"}</h1>;

  if (isShowForm) return <AddUserForm toggleShowForm={toggleShowForm} />;

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0">
      <div className="list w-full relative bg-gray-100">
        <div className="bg-white w-full shadow-lg mb-5">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3">
            <div className="w-full flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                {/* <h1
                  className="transition-all ease-in-out delay-100 text-lg py-1 p-5 border-2 border-green-600 text-green-600 lg:hover:text-white cursor-pointer lg:hover:bg-green-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => {}}
                >
                  <span className="px-2">
                    <FaDownload />
                  </span>
                  <span>Download users</span>
                </h1> */}

                <h1
                  className="transition-all ease-in-out delay-100 text-lg py-1 p-5 border-2 border-blue-600 text-blue-600 lg:hover:text-white cursor-pointer lg:hover:bg-blue-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={toggleShowForm}
                >
                  <span className="px-2">
                    <FaPlus />
                  </span>
                  <span>Add user</span>
                </h1>

                <h1 className="text-lg">
                  {filteredUsers.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-users"
                  placeholder="Search for user..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSerchUser}
                />
                <button
                  className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border "
                  onClick={() =>
                    isShowSearch
                      ? setIsShowSearch(false)
                      : setIsShowSearch(true)
                  }
                >
                  {!isShowSearch ? <FaSearch /> : <FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="lg:px-5 mb-12 overflow-auto pb-5 mt-2"
          style={{ height: "calc(100vh - 100px)" }}
        >
          {filteredUsers.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr className="rounded-full">
                  <th className="text-start px-2 font-bold py-2">
                    User number
                  </th>
                  <th className="text-start px-2 font-bold py-2">FirstName</th>
                  <th className="text-start px-2 font-bold py-2">LastName</th>
                  <th className="text-start px-2 font-bold py-2">Gender</th>
                  <th className="text-start px-2 font-bold py-2">Role</th>
                  <th className="text-start px-2 font-bold py-2">Telephone</th>
                  <th className="text-start px-2 font-bold py-2">Email</th>
                  <th className="text-start px-2 font-bold py-2">Joined</th>
                  <th className="text-start px-2 font-bold py-2">
                    Last updated
                  </th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredUsers.map((user: UserModel, index: number) => (
                  <User key={index} user={user} userIndex={index} />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyList itemName="user" />
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

export default UserList;
