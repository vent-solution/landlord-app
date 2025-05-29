import React, { useCallback, useEffect, useState } from "react";
import { TenantModel } from "../../tenants/TenantModel";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { FormatMoney } from "../../../global/actions/formatMoney";
import PaginationButtons from "../../../global/PaginationButtons";
import { getCurrencyExchange } from "../../../other/apis/CurrencyExchangeSlice";
import { AppDispatch } from "../../../app/store";
import {
  fetchRentByTenantAndAccommodation,
  getTenantRent,
  resetTenantRent,
} from "./TenantRentSlice";
import { RentModel } from "../rent/RentModel";
import axios from "axios";
import { fetchData } from "../../../global/api";
import Preloader from "../../../other/Preloader";
import TenantRentRow from "./TenantRentRow";
import {
  ACCOMMODATION_TYPE_DATA,
  PAYMENT_PARTERN,
} from "../../../global/PreDefinedData/PreDefinedData";
import RentForm from "../rent/RentForm";
import { calculateRentExpiry } from "../../../global/actions/calculateRentExpiry";
import { calculateFutureDate } from "../../receipts/calculateFutureDate";
import { getAccommodationByIdAndTenant } from "../accommodations/accommodationsSlice";
import { calculateBalanceDate } from "../../receipts/calculateBalanceDate";

interface Props {
  tenant?: TenantModel;
  accommodationId: number;
  checkIn?: string;
  toggleShowTenantDetails: () => void;
}

const TenantDetails: React.FC<Props> = ({
  tenant,
  accommodationId,
  checkIn,
  toggleShowTenantDetails,
}) => {
  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const [desiredCurrency, setDesiredCurrency] = useState<string>("");
  const [convertedPrice, setConvertedPrice] = useState<number>(0);
  const [filteredAccommodationRent, setFilteredAccommodationRent] = useState<
    RentModel[]
  >([]);

  const [searchString, setSearchString] = useState<string>("");

  const [showRentForm, setShowRentForm] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const currencyState = useSelector(getCurrencyExchange);

  const tenantRentState = useSelector(getTenantRent);
  const { tenantRent, totalElements, totalPages, page, size, status } =
    tenantRentState;

  const currentAccommodation = useSelector(
    getAccommodationByIdAndTenant(
      Number(tenant?.tenantId),
      Number(accommodationId)
    )
  );

  // set a list of currency names
  useEffect(() => {
    const currencyName = Object.keys(currencyState);
    setCurrencyNames(currencyName);
  }, [currencyState]);

  // set the converted money
  useEffect(() => {
    const fac = String(currentAccommodation?.facility.preferedCurrency);
    setConvertedPrice(
      (Number(currencyState[desiredCurrency]) / Number(currencyState[fac])) *
        Number(currentAccommodation?.price)
    );
  }, [
    currencyState,
    desiredCurrency,
    currentAccommodation?.facility.preferedCurrency,
    currentAccommodation?.price,
  ]);

  // fetch tenant rent for the current accommodation

  useEffect(() => {
    dispatch(
      fetchRentByTenantAndAccommodation({
        tenantId: Number(tenant?.tenantId),
        accommodationId: Number(currentAccommodation?.accommodationId),
        page: 0,
        size: 15,
      })
    );
  }, [dispatch, currentAccommodation?.accommodationId, tenant]);

  // filter tenant rent records
  useEffect(() => {
    const originalTenantRent =
      tenantRent.length > 0
        ? [...tenantRent]
            .sort((a, b) => {
              const aRentId = a.rentId ? parseInt(String(a.rentId), 10) : 0;
              const bRentId = b.rentId ? parseInt(String(b.rentId), 10) : 0;
              return bRentId - aRentId;
            })
            .filter(
              (rent) =>
                Number(rent.tenant.tenantId) === Number(tenant?.tenantId)
            )
        : [];
    if (searchString.trim().length === 0) {
      setFilteredAccommodationRent(originalTenantRent);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredAccommodationRent(
        originalTenantRent.filter((rent) => {
          const {
            amount,
            tenant: {
              tenantId,
              user: { firstName, lastName },
            },
            paymentType,
            dateCreated,
          } = rent;

          const tenantNumber = "TNT-" + tenantId;

          const rentYear = new Date(`${dateCreated}`).getFullYear();
          const rentMonth = new Date(`${dateCreated}`).getMonth() + 1;
          const rentDay = new Date(`${dateCreated}`).getDate();
          const rentDate = rentDay + "/" + rentMonth + "/" + rentYear;
          return (
            (rentDate && rentDate.toLowerCase().includes(searchTerm)) ||
            (firstName && firstName.toLowerCase().includes(searchTerm)) ||
            (lastName && lastName.toLowerCase().includes(searchTerm)) ||
            (tenantNumber && tenantNumber.toLowerCase().includes(searchTerm)) ||
            (paymentType && paymentType.toLowerCase().includes(searchTerm)) ||
            (amount && Number(amount) === Number(searchTerm))
          );
        })
      );
    }
  }, [searchString, tenantRent, tenant?.tenantId]);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-tenant-and-accommodation/${Number(tenant?.tenantId)}/${
          currentAccommodation?.accommodationId
        }/${page + 1}/${size}`
      );
      dispatch(resetTenantRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, currentAccommodation?.accommodationId, tenant]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-tenant-and-accommodation/${Number(
          tenant && tenant.tenantId
        )}/${currentAccommodation?.accommodationId}/${page - 1}/${size}`
      );
      dispatch(resetTenantRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, currentAccommodation?.accommodationId, tenant]);

  if (status === "loading") return <Preloader />;

  if (showRentForm)
    return (
      <RentForm
        facilityId={Number(currentAccommodation?.facility.facilityId)}
        accommodation={currentAccommodation}
        setShowRentForm={setShowRentForm}
        tenantId={Number(tenant && tenant.tenantId)}
      />
    );

  return (
    <div className="w-full py-2 px-1 lg:px-5">
      <div className="w-full m-auto h-full overflow-auto border">
        <div className="relative w-full p-2 flex flex-wrap justify-between items-center lg:sticky top-0 border z-10 bg-white pt-10">
          {tenantRent.length > 0 ? (
            <h1
              className={`text-sm py-3 lg:py-0 text-${calculateRentExpiry(
                tenantRent[0].balance,
                new Date(String(checkIn)),
                String(currentAccommodation?.paymentPartten),
                tenantRent[0].periods
              )}`}
            >
              {new Date(
                String(
                  calculateFutureDate(
                    tenantRent[0].balance,
                    new Date(String(checkIn)),
                    String(currentAccommodation?.paymentPartten),
                    tenantRent[0].periods
                  )
                )
              ).toDateString()}
            </h1>
          ) : (
            <h1>.</h1>
          )}
          <div className="price flex">
            <select
              name="currency"
              id="currency"
              className="bg-gray-200 rounded-lg p-1 mx-1 uppercase border-none outline-none"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDesiredCurrency(e.target.value)
              }
            >
              <option
                value={currentAccommodation?.facility.preferedCurrency}
                className="bg-gray-200"
              >
                {currentAccommodation?.facility.preferedCurrency}
              </option>
              {currencyNames.map((crn) => (
                <option value={crn} className="bg-gray-200">
                  {crn}
                </option>
              ))}
            </select>
            <h1 className="text-lg font-bold font-mono text-black">
              {FormatMoney(
                !desiredCurrency
                  ? Number(currentAccommodation?.price)
                  : Number(convertedPrice),
                2,
                !desiredCurrency
                  ? String(currentAccommodation?.facility.preferedCurrency)
                  : desiredCurrency
              )}
            </h1>
          </div>
          <RxCross2
            title="close"
            className="p-1 hover:bg-gray-200 text-3xl rounded-sm cursor-pointer absolute top-0 right-0 "
            onClick={() => toggleShowTenantDetails()}
          />
        </div>
        <div className="w-full h-full flex flex-wrap justify-between items-start">
          <div className="w-full lg:w-1/3">
            {/* accommodation details*/}
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold">Unit details</h2>
              <div className="p-0 flex justify-start items-center w-full">
                <p className="text-sm flex flex-wrap  px-3">
                  {/* <span className="w-full">
                    <b>ID: </b>
                    <span>
                      {"ACC-" + currentAccommodation?.accommodationId}
                    </span>
                  </span> */}
                  <span className="w-full">
                    <b>Number: </b>
                    <span>{currentAccommodation?.accommodationNumber}</span>
                  </span>
                  {currentAccommodation?.floor && (
                    <span className="w-full">
                      <b>Floor: </b>
                      <span>{currentAccommodation?.floor}</span>
                    </span>
                  )}
                  <span className="w-full">
                    <b>Type: </b>
                    <span>
                      {
                        ACCOMMODATION_TYPE_DATA.find(
                          (type) =>
                            type.value ===
                            currentAccommodation?.accommodationType
                        )?.label
                      }
                    </span>
                  </span>

                  {currentAccommodation?.accommodationCategory && (
                    <span className="w-full">
                      <b>Category: </b>
                      <span>{currentAccommodation?.accommodationCategory}</span>
                    </span>
                  )}
                  <span className="w-full">
                    <b>Capacity: </b>
                    <span>{currentAccommodation?.capacity}</span>
                  </span>
                  <span className="w-full">
                    <b>Price: </b>
                    <span className="font-mono">
                      {FormatMoney(
                        !desiredCurrency
                          ? Number(currentAccommodation?.price)
                          : Number(convertedPrice),
                        2,
                        !desiredCurrency
                          ? String(
                              currentAccommodation?.facility.preferedCurrency
                            )
                          : desiredCurrency
                      )}
                    </span>
                    /{" "}
                    {
                      PAYMENT_PARTERN.find(
                        (pattern) =>
                          pattern.value === currentAccommodation?.paymentPartten
                      )?.label
                    }
                  </span>
                  <span className="w-full">
                    <b>Status: </b>
                    <span>{currentAccommodation?.availability}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* tenant details*/}
            <div className="p-4 w-full">
              <h2 className="text-xl flex justify-between items-center font-bold">
                <span className="font-bold">Tenant</span>
                <span className="px-2 py-1 text-gray-500 bg-gray-100 text-sm rounded-full font-light ">
                  {new Date(String(checkIn)).toDateString()}
                </span>
              </h2>
              <div className="p-2 flex justify-start items-center w-full  my-2">
                <p className="text-sm flex flex-wrap">
                  <span className="w-full py-1">
                    <b>No: </b>
                    <span>{"TNT-" + (tenant && tenant.tenantId)}</span>
                  </span>
                  <span className="w-full py-1">
                    <b>Name: </b>
                    {tenant && !tenant.companyName && (
                      <span>
                        {tenant &&
                          tenant.user.firstName + " " + tenant.user.lastName}
                      </span>
                    )}
                    {tenant && tenant.companyName && (
                      <span>{tenant && tenant.companyName}</span>
                    )}
                  </span>
                  <span className="w-full py-1">
                    <b>Tel: </b>
                    <span>{tenant && tenant.user.userTelephone}</span>
                  </span>

                  <span className="w-full py-1">
                    <b>Email: </b>
                    <span>{tenant && tenant.user.userEmail}</span>
                  </span>
                  <span className="w-full py-1">
                    <b>ID: </b>
                    <span>{tenant && tenant.nationalId}</span>
                  </span>
                  <span className="w-full py-1">
                    <b>ID Type: </b>
                    <span>{tenant && tenant.idType}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* next of kin details*/}
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold">Next of kin</h2>
              <div className="p-2 flex justify-start items-center w-full  my-2">
                <p className="text-sm flex flex-wrap">
                  <span className="w-full">
                    <b>Name: </b>

                    <span>{tenant && tenant.nextOfKin?.nokName}</span>
                  </span>
                  {tenant && tenant.nextOfKin?.nokEmail && (
                    <span className="w-full">
                      <b>Email: </b>
                      <span>{tenant && tenant.nextOfKin?.nokEmail}</span>
                    </span>
                  )}

                  <span className="w-full">
                    <b>Tel: </b>
                    <span>{tenant && tenant.nextOfKin?.nokTelephone}</span>
                  </span>
                  <span className="w-full">
                    <b>ID: </b>
                    <span>{tenant && tenant.nextOfKin?.nokNationalId}</span>
                  </span>
                  <span className="w-full">
                    <b>ID Type: </b>
                    <span>{tenant && tenant.nextOfKin?.nokIdType}</span>
                  </span>
                  <span className="w-full">
                    <b>Address: </b>
                    <span>
                      {tenant &&
                        tenant.nextOfKin?.address?.city +
                          ", " +
                          tenant.nextOfKin?.address?.country}
                    </span>
                  </span>

                  <span className="w-full">
                    <b>Address Type: </b>
                    <span>{tenant && tenant.nextOfKin?.addressType}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* tenant's rent records */}
          <div className="w-full lg:w-2/3 p-0 relative  lg:h-[calc(100vh-200px)] border ">
            <div className="w-full flex flex-wrap justify-between lg:justify-around items-center py-5 px-2 lg:px-5 ">
              <h2 className="text-center font-bold text-xl">Rent records</h2>
              <h2
                className="py-1 px-5 bg-blue-600 lg:hover:bg-blue-400 text-white cursor-pointer text-sm"
                onClick={() => setShowRentForm(true)}
              >
                Add a payment
              </h2>
              {tenantRent.length > 0 ? (
                <h1 className="text-sm font-light pt-5 lg:pt-0">
                  Balance for{" "}
                  {calculateBalanceDate(
                    // tenantRent[0].balance,
                    new Date(String(checkIn)),
                    String(currentAccommodation?.paymentPartten),
                    tenantRent[0].periods
                  )}
                  :{" "}
                  {FormatMoney(
                    Number(tenantRent[0].balance),
                    2,
                    tenantRent[0].currency
                  )}
                </h1>
              ) : (
                <h1>.</h1>
              )}
            </div>
            <div className="flex w-full items-center justify-end px-2 lg:px-10 py-2">
              <h3 className="px-10 text-sm font-bold">
                {filteredAccommodationRent.length + "/" + totalElements}
              </h3>
              <div
                className={` rounded-full  bg-white flex justify-between border-gray-400 border-2 w-3/4 lg:w-2/4 h-3/4 mt-0 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-rent"
                  placeholder="Search for rent record..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchString(e.target.value)
                  }
                />

                <button className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-sm text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
            <div className="lg:pb-12 lg:h-[calc(100vh-420px)] overflow-auto">
              <table className="w-full px-1 text-center text-sm bg-cyan-50">
                <thead className="bg-blue-900 text-white sticky top-0">
                  <tr className="border-y-blue-500">
                    {/* <th className="text-white">Tenant</th> */}
                    <th>Unit</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Paid</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody className="">
                  {filteredAccommodationRent.map((fr, index) => (
                    <TenantRentRow key={index} rent={fr} />
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationButtons
              handleFetchNextPage={handleFetchNextPage}
              handleFetchPreviousPage={handleFetchPreviousPage}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetails;
