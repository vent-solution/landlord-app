import React, { useEffect } from "react";
import PaginationButtons from "../../global/PaginationButtons";
import FacilityRow from "./FacilityRow";
import { FacilitiesModel } from "./FacilityModel";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import { fetchFacilities } from "./FacilitiesSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { UserModel } from "../users/models/userModel";

interface Props {
  filteredFacilities: FacilitiesModel[];
  page: number;
  totalPages: number;
  handleFetchNextPage: () => Promise<void>;
  handleFetchPreviousPage: () => Promise<void>;
}

const FacilitiesTable: React.FC<Props> = ({
  filteredFacilities,
  page,
  totalPages,
  handleFetchNextPage,
  handleFetchPreviousPage,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // fetch facilities that belong to the current landlord
  useEffect(() => {
    let userId: number;
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    if (currentUser?.userRole !== UserRoleEnum.landlord) {
      userId = Number(currentUser?.linkedTo);
    } else {
      userId = Number(currentUser.userId);
    }

    dispatch(
      fetchFacilities({
        userId: Number(userId),
        page: 0,
        size: 50,
      })
    );
  }, [dispatch]);

  return (
    <div className="lg:px-5 mb-12 overflow-auto pb-5 mt-2 h-[calc(100vh-150px)]">
      {filteredFacilities && filteredFacilities.length > 0 ? (
        <table className="border-2 w-full bg-white text-center shadow-lg">
          <thead className="bg-blue-900 text-white sticky top-0">
            <tr className="text-sm">
              <th className="px-2 font-bold py-2">#</th>
              <th className="px-2 font-bold">No.</th>
              <th className="px-2 font-bold">Business</th>
              <th className="px-2 font-bold">Category</th>
              <th className="px-2 font-bold">Name</th>
              <th className="px-2 font-bold">Location</th>
              <th className="px-2 font-bold">Status</th>
              {/* <th className="px-2 font-bold">Price</th> */}
              <th className="px-2 font-bold">Monthly Bid</th>
              <th className="px-2 font-bold">Registered</th>
              {/* <th className="px-2 font-bold">View</th> */}
            </tr>
          </thead>
          <tbody className="font-light">
            {filteredFacilities.map((facility, index) => (
              <FacilityRow
                key={index}
                facilityIndex={index}
                facility={facility}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="w-ull h-5/6 flex justify-center items-center">
          <div
            className="w-80 h-80"
            style={{
              background: "URL('/images/Ghost.gif')",
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      )}
      <PaginationButtons
        page={page}
        totalPages={totalPages}
        handleFetchNextPage={handleFetchNextPage}
        handleFetchPreviousPage={handleFetchPreviousPage}
      />
    </div>
  );
};

export default FacilitiesTable;
