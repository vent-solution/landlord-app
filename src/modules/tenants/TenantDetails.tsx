import React, { useCallback, useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";

import axios from "axios";
import { AppDispatch } from "../../app/store";
import { FormatMoney } from "../../global/actions/formatMoney";
import { fetchData, postData } from "../../global/api";
import PaginationButtons from "../../global/PaginationButtons";
import {
  ACCOMMODATION_TYPE_DATA,
  PAYMENT_PARTERN,
} from "../../global/PreDefinedData/PreDefinedData";
import { getCurrencyExchange } from "../../other/apis/CurrencyExchangeSlice";
import Preloader from "../../other/Preloader";
import { AccommodationModel } from "../facilities/accommodations/AccommodationModel";
import { getAccommodationByTenant } from "../facilities/accommodations/accommodationsSlice";
import RentForm from "../facilities/rent/RentForm";
import { RentModel } from "../facilities/rent/RentModel";
import TenantRentRow from "../facilities/tenants/TenantRentRow";
import {
  getTenantRent,
  fetchRentByTenantAndAccommodation,
  resetTenantRent,
} from "../facilities/tenants/TenantRentSlice";
import { TenantModel } from "./TenantModel";
import { calculateRentExpiry } from "../../global/actions/calculateRentExpiry";
import { calculateFutureDate } from "../receipts/calculateFutureDate";
import { calculateBalanceDate } from "../receipts/calculateBalanceDate";
import {
  checkOutTenant,
  getHistoryByAccommodationIdAndTenantId,
} from "./TenantsSlice";
import { setUserAction } from "../../global/actions/actionSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { UserActivity } from "../../global/enums/userActivity";
import { setAlert } from "../../other/alertSlice";
import { setConfirm } from "../../other/ConfirmSlice";
import { SocketMessageModel } from "../../webSockets/SocketMessageModel";
import { webSocketService } from "../../webSockets/socketService";
import { UserModel } from "../users/models/userModel";

interface Props {
  tenant?: TenantModel;
  accommodation?: AccommodationModel;
  checkIn: string | undefined;
  toggleShowTenantDetails: () => void;
}

const TenantDetails: React.FC<Props> = ({
  tenant,
  accommodation,
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
  const tenantAccommodation = useSelector(
    getAccommodationByTenant(Number(tenant && tenant.tenantId))
  );

  const currencyState = useSelector(getCurrencyExchange);

  const tenantRentState = useSelector(getTenantRent);
  const { tenantRent, totalElements, totalPages, page, size, status } =
    tenantRentState;

  const tenantHistory = useSelector(
    getHistoryByAccommodationIdAndTenantId(
      Number(accommodation?.accommodationId),
      Number(tenant?.tenantId)
    )
  );

  // set a list of currency names
  useEffect(() => {
    const currencyName = Object.keys(currencyState);
    setCurrencyNames(currencyName);
  }, [currencyState]);

  // set the converted money
  useEffect(() => {
    const fac = String(tenantAccommodation?.facility.preferedCurrency);
    setConvertedPrice(
      (Number(currencyState[desiredCurrency]) / Number(currencyState[fac])) *
        Number(tenantAccommodation?.price)
    );
  }, [
    currencyState,
    desiredCurrency,
    tenantAccommodation?.facility.preferedCurrency,
    tenantAccommodation?.price,
  ]);

  // fetch tenant rent for the current accommodation

  useEffect(() => {
    dispatch(
      fetchRentByTenantAndAccommodation({
        tenantId: Number(tenant?.tenantId),
        accommodationId: Number(accommodation?.accommodationId),
        page: 0,
        size: 15,
      })
    );
  }, [dispatch, accommodation?.accommodationId, tenant]);

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
        `/fetch-rent-by-tenant-and-accommodation/${Number(
          tenant?.tenantId
        )}/${Number(accommodation?.accommodationId)}/${page + 1}/${size}`
      );
      dispatch(resetTenantRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, accommodation?.accommodationId, tenant]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-tenant-and-accommodation/${Number(
          tenant?.tenantId
        )}/${Number(accommodation?.accommodationId)}/${page - 1}/${size}`
      );
      dispatch(resetTenantRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, accommodation?.accommodationId, tenant]);

  if (status === "loading") return <Preloader />;

  if (showRentForm)
    return (
      <RentForm
        facilityId={accommodation?.facility.facilityId}
        accommodation={accommodation}
        setShowRentForm={setShowRentForm}
        tenantId={Number(tenant && tenant.tenantId)}
        tenants={tenant ? [tenant] : []}
      />
    );

  return (
    <div className="w-full py-24 lg:py-2 px-5">
      <div className="w-full m-auto h-fit border">
        <div className="w-full p-2 flex flex-wrap justify-between items-center sticky top-0 lg:pt-10  z-10 bg-white border">
          {tenantRent.length > 0 ? (
            <h1
              className={`w-full py-5 lg:py-0 lg:w-fit text-sm font-bold text-${calculateRentExpiry(
                tenantRent[0].balance,
                new Date(String(checkIn)),
                String(accommodation?.paymentPartten),
                tenantRent[0].periods
              )}`}
            >
              {new Date(
                String(
                  calculateFutureDate(
                    tenantRent[0].balance,
                    new Date(String(tenantHistory?.checkIn)),
                    String(accommodation?.paymentPartten),
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
                value={accommodation?.facility.preferedCurrency}
                className="bg-gray-200"
              >
                {accommodation?.facility.preferedCurrency}
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
                  ? Number(accommodation?.price)
                  : Number(convertedPrice),
                2,
                !desiredCurrency
                  ? String(accommodation?.facility.preferedCurrency)
                  : desiredCurrency
              )}
            </h1>
          </div>
          <RxCross1
            title="close"
            className="p-1 lg:hover:bg-red-600 lg:hover:text-white text-3xl rounded-sm cursor-pointer absolute top-0 right-0"
            onClick={() => toggleShowTenantDetails()}
          />
        </div>
        <div className="w-full h-full flex flex-wrap justify-between items-start">
          <div className="w-full lg:w-1/3">
            {/* accommodation details*/}
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold">Unit details</h2>
              <div className="p-2 flex justify-start items-center w-full">
                <p className="text-sm flex flex-wrap">
                  <span className="w-full py-1">
                    <b>Facility number: </b>
                    <span>{"FAC-" + accommodation?.facility.facilityId}</span>
                  </span>
                  <span className="w-full py-1">
                    <b>Facility name: </b>
                    <span>{accommodation?.facility.facilityName}</span>
                  </span>
                  <span className="w-full py-1">
                    <b>Facility Location: </b>
                    <span>
                      {accommodation?.facility.facilityLocation.city}{" "}
                      {accommodation?.facility.facilityLocation.country}
                    </span>
                  </span>
                  <span className="w-full py-1">
                    <b>Unit number: </b>
                    <span>{accommodation?.accommodationNumber}</span>
                  </span>
                  {accommodation?.floor && (
                    <span className="w-full py-1">
                      <b>Floor: </b>
                      <span>{accommodation?.floor}</span>
                    </span>
                  )}
                  <span className="w-full py-1">
                    <b>Type: </b>
                    <span>
                      {
                        ACCOMMODATION_TYPE_DATA.find(
                          (type) =>
                            type.value === accommodation?.accommodationType
                        )?.label
                      }
                    </span>
                  </span>

                  {accommodation?.accommodationCategory && (
                    <span className="w-full py-1">
                      <b>Category: </b>
                      <span>{accommodation?.accommodationCategory}</span>
                    </span>
                  )}
                  <span className="w-full py-1">
                    <b>Capacity: </b>
                    <span>{accommodation?.capacity}</span>
                  </span>
                  <span className="w-full py-1">
                    <b>Price: </b>
                    <span className="font-mono">
                      {FormatMoney(
                        !desiredCurrency
                          ? Number(accommodation?.price)
                          : Number(convertedPrice),
                        2,
                        !desiredCurrency
                          ? String(accommodation?.facility.preferedCurrency)
                          : desiredCurrency
                      )}
                    </span>{" "}
                    /{" "}
                    {
                      PAYMENT_PARTERN.find(
                        (pattern) =>
                          pattern.value === accommodation?.paymentPartten
                      )?.label
                    }
                  </span>
                  <span className="w-full py-1">
                    <b>Status: </b>
                    <span>{accommodation?.availability}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* tenant details*/}
            <div className="p-4 w-full">
              <h2 className="text-xl flex justify-between items-center font-bold">
                <span className="font-bold">Tenant</span>
                <span className="px-2 py-1 text-gray-500 bg-gray-100 text-sm rounded-full ">
                  {new Date(String(tenantHistory?.checkIn)).toDateString()}
                </span>
              </h2>
              <div className="p-2 flex flex-wrap justify-start items-center w-full my-2">
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
                <div className="py-3 w-full text-sm">
                  <button
                    className="py-1 px-3 rounded-lg bg-gray-300 hover:bg-gray-100 font-extrabold"
                    onClick={() => {
                      // handle checkout tenant
                      const handleCheckOutTenant = async () => {
                        const currentUser: UserModel = JSON.parse(
                          localStorage.getItem("dnap-user") as string
                        );

                        try {
                          const result = await postData(
                            `/checkout-tenant/${Number(
                              currentUser.userId
                            )}/${Number(
                              accommodation?.accommodationId
                            )}/${Number(tenant?.tenantId)}`,
                            {}
                          );

                          if (
                            result.data.status &&
                            result.data.status !== "OK"
                          ) {
                            dispatch(
                              setAlert({
                                message: result.data.message,
                                status: true,
                                type: AlertTypeEnum.danger,
                              })
                            );
                            return;
                          }

                          dispatch(
                            setAlert({
                              type: AlertTypeEnum.success,
                              status: true,
                              message: result.data.message,
                            })
                          );

                          dispatch(checkOutTenant(Number(tenant?.tenantId)));

                          const socketMessage: SocketMessageModel = {
                            userId: Number(currentUser.userId),
                            userRole: String(currentUser.userRole),
                            content: String(accommodation?.accommodationId),
                            activity: UserActivity.checkOutTenant,
                          };

                          webSocketService.sendMessage(
                            "/app/check-out-tenant",
                            socketMessage
                          );
                        } catch (error) {
                          if (axios.isCancel(error)) {
                            console.log(
                              "CHECKOUT TENANT CANCELLED: ",
                              error.message
                            );
                          }
                        } finally {
                          toggleShowTenantDetails();
                          dispatch(
                            setConfirm({
                              message: "",
                              status: false,
                            })
                          );
                        }
                      };

                      dispatch(
                        setUserAction({ userAction: handleCheckOutTenant })
                      );

                      dispatch(
                        setConfirm({
                          message: `Are you sure you want to check out tenant (TNT-${tenant?.tenantId}) from Unit (${accommodation?.accommodationNumber}) of facility (FAC-${accommodation?.facility.facilityId}) `,
                          status: true,
                        })
                      );
                    }}
                  >
                    Check out
                  </button>
                </div>
              </div>
            </div>

            {/* next of kin details*/}
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold">Next of kin</h2>
              <div className="p-2 flex justify-start items-center w-full my-2">
                <p className="text-sm flex flex-wrap">
                  <span className="w-full">
                    <b>Name: </b>

                    <span>{tenant && tenant.nextOfKin?.nokName}</span>
                  </span>
                  {tenant && tenant.nextOfKin?.nokEmail && (
                    <span className="w-full py-1">
                      <b>Email: </b>
                      <span>{tenant && tenant.nextOfKin?.nokEmail}</span>
                    </span>
                  )}

                  <span className="w-full py-1">
                    <b>Tel: </b>
                    <span>{tenant && tenant.nextOfKin?.nokTelephone}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* tenant's rent records */}
          <div className="w-full lg:w-2/3 p-0 lg:py-5 relative border">
            <div className="w-full flex flex-wrap justify-between items-center py-5 px-2 lg:px-2">
              <h2 className="text-center font-bold text-xl">Rent records</h2>
              <h2
                className="py-1 px-2 lg:px-5 bg-blue-600 lg:hover:bg-blue-400 text-white cursor-pointer text-sm"
                onClick={() => setShowRentForm(true)}
              >
                Add a payment
              </h2>
              {tenantRent.length > 0 ? (
                <h2 className="text-sm font-light py-2">
                  Balance for{" "}
                  {new Date(
                    String(
                      calculateBalanceDate(
                        new Date(String(tenantHistory?.checkIn)),
                        String(accommodation?.paymentPartten),
                        tenantRent[0].periods
                      )
                    )
                  ).toDateString()}
                  {": "}
                  {FormatMoney(
                    Number(tenantRent[0].balance),
                    2,
                    tenantRent[0].currency
                  )}
                </h2>
              ) : (
                <h2>.</h2>
              )}
            </div>
            <div className="flex w-full items-center justify-between lg:justify-end px-2 lg:px-10 py-5 lg:py-2">
              <h3 className="px-2 lg:px-10 text-sm font-bold">
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

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-sm text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
            <div className="lg:pb-12 h-[calc(100vh-250px)] overflow-auto">
              <table className="w-full px-1 text-center text-sm bg-cyan-50">
                <thead className="bg-blue-900 text-white">
                  <tr className="border-y-blue-500">
                    {/* <th className="text-white">Tenant</th> */}
                    <th>Unit</th>
                    <th>Amount</th>
                    <th>Payment type</th>
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
