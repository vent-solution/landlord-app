import React, { useCallback, useEffect, useState } from "react";
import { FaDownload, FaSearch } from "react-icons/fa";
import Tenant from "./Tenant";
import { useDispatch, useSelector } from "react-redux";
import { HistoryModel } from "../facilities/history/HistoryModel";
import { getLandlordTenants, resetLandlordTenants } from "./TenantsSlice";
import PaginationButtons from "../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../global/api";
import { AppDispatch } from "../../app/store";
import { getFacilities } from "../facilities/FacilitiesSlice";
import TenantsFilterForm from "./TenantsFilterForm";
import EmptyList from "../../global/EmptyList";

interface Props {
  // facility: FacilitiesModel;
  setTenantId: React.Dispatch<React.SetStateAction<number>>;
  toggleShowTenantDetails: () => void;
  setSelectedAccommodationId: React.Dispatch<React.SetStateAction<number>>;
}

const TenantsList: React.FC<Props> = ({
  setTenantId,
  toggleShowTenantDetails,
  setSelectedAccommodationId,
}) => {
  const [filteredTenants, setFilteredTenants] = useState<HistoryModel[]>([]);
  const [searchString, setSerachString] = useState<string>("");
  const [isShowReportFilterForm, setIsShowReportFilterForm] = useState(false);

  const tenantsState = useSelector(getLandlordTenants);
  const { landlordTenants, page, totalPages, size, totalElements } =
    tenantsState;

  const dispatch = useDispatch<AppDispatch>();

  const facilities = useSelector(getFacilities);

  // filter tenants
  useEffect(() => {
    const searchTearm = searchString || "";
    const originalTenants = landlordTenants;

    if (searchTearm.trim().length < 1) {
      setFilteredTenants(originalTenants);
    } else {
      setFilteredTenants(
        originalTenants.filter((tnt) => {
          const tenantNumber = "TNT-" + tnt.tenant.tenantId;
          const facilityNumber = "FAC-" + tnt.accommodation.facility.facilityId;
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
            (tenantNumber &&
              tenantNumber.toLocaleLowerCase().includes(searchTearm)) ||
            (facilityNumber &&
              facilityNumber.toLocaleLowerCase().includes(searchTearm))
          );
        })
      );
    }
  }, [searchString, landlordTenants]);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    const facilityIds = facilities.facilities.map((facility) =>
      Number(facility.facilityId)
    );

    try {
      const result = await fetchData(
        `/fetch-landlord-tenants/${facilityIds}/${page + 1}/${size}`
      );
      dispatch(resetLandlordTenants(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TENANTS CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, facilities.facilities]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    const facilityIds = facilities.facilities.map((facility) =>
      Number(facility.facilityId)
    );

    try {
      const result = await fetchData(
        `/fetch-landlord-tenants/${facilityIds}/${page - 1}/${size}`
      );
      dispatch(resetLandlordTenants(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TENANTS CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, facilities.facilities]);

  const handleSerachTenant = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSerachString(value);
  };

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0 relative">
      <div className="list w-full relative bg-gray-200">
        <div className="bg-white w-full shadow-lg mb-5">
          <div className="w-full h-1/3 flex flex-wrap justify-around items-center px-2 lg:px-10 py-3">
            <div className="w-full flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-2/3 flex justify-between lg:justify-around items-center">
                <button
                  className="transition-all ease-in-out delay-100 py-1 p-5 border-2 border-green-600 text-green-600 lg:hover:text-white cursor-pointer lg:hover:bg-green-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => setIsShowReportFilterForm(true)}
                >
                  <span className="pr-2">
                    <FaDownload />
                  </span>
                  <span>Report</span>
                </button>
                <h1 className="text-xl text-blue-900 tracking-wide font-bold">
                  Tenants
                </h1>
                <h1 className="text-lg font-bold mr-2 lg:mr-0">
                  {filteredTenants.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
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

        <div
          className="lg:px-5 mb-12 overflow-auto pb-5 relative"
          style={{ height: "calc(100vh - 170px)" }}
        >
          {filteredTenants.length > 0 ? (
            <table className="border-2 w-full bg-white text-center shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-white">
                <tr>
                  {/* <th className="text-start px-2 font-bold">#</th> */}
                  <th className="text-start p-2 font-bold">Facility</th>
                  <th className="text-start p-2 font-bold">Unit Number</th>
                  <th className="text-start p-2 font-bold">Floor</th>
                  <th className="text-start p-2 font-bold">Unit Category</th>
                  <th className="text-start p-2 font-bold">Tenant Number</th>
                  <th className="text-start p-2 font-bold">Tenant Name</th>
                  <th className="text-start p-2 font-bold">Tenant Telephone</th>
                  <th className="text-start p-2 font-bold">Tenant Email</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredTenants.map((history, index: number) => (
                  <Tenant
                    key={index}
                    history={history}
                    tenantIndex={index}
                    setTenantId={setTenantId}
                    toggleShowTenantDetails={toggleShowTenantDetails}
                    setSelectedAccommodationId={setSelectedAccommodationId}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyList itemName="tenant" />
          )}
        </div>
        <PaginationButtons
          page={page}
          totalPages={totalPages}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>
      <TenantsFilterForm
        isShowReportFilterForm={isShowReportFilterForm}
        setIsShowReportFilterForm={setIsShowReportFilterForm}
      />
    </div>
  );
};

export default TenantsList;
