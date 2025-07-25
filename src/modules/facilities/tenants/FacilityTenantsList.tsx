import React, { useCallback, useEffect, useState } from "react";
import { FacilitiesModel } from "../FacilityModel";
import { FaSearch } from "react-icons/fa";
import Tenant from "./Tenant";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacilityTenants, getFacilityTenants } from "./TenantsSlice";
import { HistoryModel } from "../history/HistoryModel";
import { AppDispatch } from "../../../app/store";
import PaginationButtons from "../../../global/PaginationButtons";
import EmptyList from "../../../global/EmptyList";

interface Props {
  facility: FacilitiesModel;
  setTenantId: React.Dispatch<React.SetStateAction<number>>;
  setAccommodationId: React.Dispatch<React.SetStateAction<number>>;
  toggleShowTenantDetails: () => void;
}

const TenantsList: React.FC<Props> = ({
  facility,
  setTenantId,
  setAccommodationId,
  toggleShowTenantDetails,
}) => {
  const [filteredTenants, setFilteredTenants] = useState<HistoryModel[]>([]);
  const [searchString, setSerachString] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const tenantsState = useSelector(getFacilityTenants);
  const { facilityTenants, page, size, totalPages, totalElements } =
    tenantsState;

  // filter tenants
  useEffect(() => {
    const searchTearm = searchString || "";
    const originalTenants = facilityTenants;

    if (searchTearm.trim().length < 1) {
      setFilteredTenants(originalTenants);
    } else {
      setFilteredTenants(
        originalTenants.filter((tnt) => {
          const tenantNumber = "TNT-" + tnt.tenant.tenantId;
          return (
            (tnt.tenant.companyName &&
              tnt.tenant.companyName
                .toLocaleLowerCase()
                .includes(searchTearm)) ||
            (tnt.tenant.user.firstName &&
              tnt.tenant.user.firstName
                .toLocaleLowerCase()
                .includes(searchTearm)) ||
            (tnt.tenant.user.lastName &&
              tnt.tenant.user.lastName
                .toLocaleLowerCase()
                .includes(searchTearm)) ||
            (tnt.tenant.user.userTelephone &&
              tnt.tenant.user.userTelephone
                .toLocaleLowerCase()
                .includes(searchTearm)) ||
            (tnt.tenant.user.userEmail &&
              tnt.tenant.user.userEmail
                .toLocaleLowerCase()
                .includes(searchTearm)) ||
            (tenantNumber &&
              tenantNumber.toLocaleLowerCase().includes(searchTearm))
          );
        })
      );
    }
  }, [facility.tenants, searchString, facilityTenants]);

  const handleSerachTenant = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSerachString(value);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    dispatch(
      fetchFacilityTenants({
        facilityId: Number(facility.facilityId),
        page: page + 1,
        size: size,
      })
    );
  }, [dispatch, page, size, facility.facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    dispatch(
      fetchFacilityTenants({
        facilityId: Number(facility.facilityId),
        page: page - 1,
        size: size,
      })
    );
  }, [dispatch, page, size, facility.facilityId]);

  return (
    <div className="users-list flex w-full py-2 mt-0 lg:mt-0 z-0">
      <div className="list w-full bg-gray-200 lg:h-[calc(100vh-150px)] relative">
        <div className=" w-full mb-5">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-2 lg:px-10 py-3">
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-1/4 lg:w-1/2 flex justify-between lg:justify-around items-center">
                <h1 className="text-lg font-bold">
                  {filteredTenants.length}/{totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-3/4 lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for bid..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSerachTenant}
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:px-5 mb-12 overflow-auto pb-5 h-[calc(100vh-330px)]">
          {filteredTenants.length > 0 ? (
            <table className="border-2 w-full bg-white text-center shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-white text-sm">
                <tr>
                  {/* <th className="p-2 text-start font-bold">#</th> */}
                  {/* <th className="p-2 text-start font-bold">Facility</th> */}
                  <th className="p-2 text-start font-bold">Unit</th>
                  <th className="p-2 text-start font-bold">Floor</th>
                  <th className="p-2 text-start font-bold">Category</th>
                  <th className="p-2 text-start font-bold">Tenant</th>
                  <th className="p-2 text-start font-bold">Name</th>
                  <th className="p-2 text-start font-bold">Telephone</th>
                  <th className="p-2 text-start font-bold">Email</th>
                  <th className="p-2 text-start font-bold">CheckIn</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {facilityTenants.map((history, index: number) => (
                  <Tenant
                    key={index}
                    history={history}
                    tenantIndex={index}
                    setTenantId={setTenantId}
                    setAccommodationId={setAccommodationId}
                    toggleShowTenantDetails={toggleShowTenantDetails}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyList itemName={"tenant"} />
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

export default TenantsList;
