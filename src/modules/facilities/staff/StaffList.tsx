import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { UserModel } from "../../users/models/userModel";
import StaffRow from "./StaffRow";

interface Props {
  manager: UserModel;
}

const StaffList: React.FC<Props> = ({ manager }) => {
  const [staffData] = useState<UserModel[]>([manager]);
  const [filteredStaff, setFilteredStaff] = useState<UserModel[]>();
  const [searchString, setSearchString] = useState<string>("");

  // handle search staff
  const handleSearchStaff = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  useEffect(() => {
    const originalStaffData = staffData;
    if (searchString.trim().length < 1) {
      setFilteredStaff(originalStaffData);
    } else {
      setFilteredStaff(
        originalStaffData.filter((staff) => {
          return (
            staff.firstName
              ?.trim()
              .toLocaleLowerCase()
              .includes(searchString) ||
            staff.lastName?.trim().toLocaleLowerCase().includes(searchString)
          );
        })
      );
    }
  }, [searchString, staffData]);

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0">
      <div className="list w-full bg-gray-100">
        <div className="bg-white w-full shadow-lg mb-2">
          <div className="w-full h-1/3 flex flex-wrap justify-between items-center px-10 py-3">
            <div className="w-full lg:w-1/4">
              {/* <h1 className="text-blue-950 text-2xl font-bold font-mono ">
                Vent
              </h1> */}
            </div>

            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center">
                {/* <h1 className="text-xl text-blue-900 font-bold">Bids</h1> */}
                <h1 className="text-lg font-bold">
                  {filteredStaff?.length + "/" + staffData.length}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for bid..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchStaff}
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
          style={{ height: "calc(100vh - 70px)" }}
        >
          {filteredStaff && filteredStaff?.length > 0 ? (
            <table className="border-2 w-full bg-white bordered mt-2 shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr>
                  <th className="px-2">#</th>
                  <th className="px-2">User number</th>
                  <th className="px-2">First name</th>
                  <th className="px-2">Last name</th>
                  <th className="px-2">Gender</th>
                  <th className="px-2">Role</th>
                  <th className="px-2">Telephone</th>
                  <th className="px-2">Email</th>
                  <th className="px-2">Date added</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredStaff.map((staff: UserModel, index: number) => (
                  <StaffRow staff={staff} staffIndex={index} />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-full flex justify-center items-center">
              <div
                className="w-80 h-80"
                style={{
                  background: "URL('/images/Ghost.gif')",
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          )}
          {/* <PaginationButtons
            page={page}
            totalPages={totalPages}
            handleFetchNextPage={handleFetchNextPage}
            handleFetchPreviousPage={handleFetchPreviousPage}
          /> */}
        </div>
      </div>
      {/* <AlertMessage /> */}
    </div>
  );
};

export default StaffList;
