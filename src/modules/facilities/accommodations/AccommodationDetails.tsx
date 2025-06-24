import React, { useCallback, useEffect, useState } from "react";
import { AccommodationModel } from "./AccommodationModel";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { FormatMoney } from "../../../global/actions/formatMoney";
import PaginationButtons from "../../../global/PaginationButtons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccommodationRent,
  getAccommodationRent,
  resetAccommodationRent,
} from "./AccommodationRentSlice";
import { getCurrencyExchange } from "../../../other/apis/CurrencyExchangeSlice";
import { FaSearch } from "react-icons/fa";
import { AppDispatch } from "../../../app/store";
import { RentModel } from "../rent/RentModel";
import AccommodationRentRow from "./AccommodationRentRow";
import { deleteData, fetchData, postData } from "../../../global/api";
import axios from "axios";
import Preloader from "../../../other/Preloader";
import {
  ACCOMMODATION_CATEGORY,
  ACCOMMODATION_TYPE_DATA,
  PAYMENT_PARTERN,
} from "../../../global/PreDefinedData/PreDefinedData";
import { useNavigate } from "react-router-dom";
import { setUserAction } from "../../../global/actions/actionSlice";
import { setConfirm } from "../../../other/ConfirmSlice";
import { setAlert } from "../../../other/alertSlice";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { deleteAccommodation } from "./accommodationsSlice";
import { TenantChoiceEnum } from "./tenantChoiceEnum";
import TenantIdForm from "./TenantIdForm";
import { UserModel } from "../../users/models/userModel";
import { TenantModel } from "../../tenants/TenantModel";
import RentForm from "../rent/RentForm";
import TenantForm from "../../tenants/TenantForm";
import { getHistoryByAccommodationId } from "../tenants/TenantsSlice";
import { SocketMessageModel } from "../../../webSockets/SocketMessageModel";
import { UserActivity } from "../../../global/enums/userActivity";
import { webSocketService } from "../../../webSockets/socketService";
import { AccommodationAvailability } from "../../../global/enums/accommodationAvailability";
import convertCurrency from "../../../global/actions/currencyConverter";
import { parseISO } from "date-fns";

interface Props {
  accommodation?: AccommodationModel;
  toggleShowAccommodationDetails: () => void;

  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

// tenant choices
const TENANT_CHOICES = [
  { label: "Existing tenant", value: TenantChoiceEnum.existingTenant },
  { label: "New tenant", value: TenantChoiceEnum.newTenant },
];

const currentUser: UserModel = JSON.parse(
  localStorage.getItem("dnap-user") as string
);

const AccommodationDetails: React.FC<Props> = ({
  accommodation,
  toggleShowAccommodationDetails,
  setShowForm,
}) => {
  const [currencyNames, setCurrencyNames] = useState<string[]>([]);
  const [desiredCurrency, setDesiredCurrency] = useState<string>("");
  const [convertedPrice, setConvertedPrice] = useState<number>(0);
  const [filteredAccommodationRent, setFilteredAccommodationRent] = useState<
    RentModel[]
  >([]);

  const [searchString, setSearchString] = useState<string>("");

  const [isCheckInExistingTenant, setIsCheckInExistingTenant] =
    useState<boolean>(false);

  const [isCheckInNewTenant, setIsCheckInNewTenant] = useState<boolean>(false);

  const [tenantChoice, setTenantChoice] = useState<{
    label: string;
    value: string;
  }>({
    label: "",
    value: "",
  });

  const [tenants, setTenants] = useState<TenantModel[] | undefined>(
    accommodation?.tenants
  );

  const [showRentForm, setShowRentForm] = useState<boolean>(false);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const accommodationRentState = useSelector(getAccommodationRent);
  const { accommodationRent, page, size, totalElements, totalPages, status } =
    accommodationRentState;

  const tenantHistory = useSelector(
    getHistoryByAccommodationId(Number(accommodation?.accommodationId))
  );

  const currencyState = useSelector(getCurrencyExchange);

  // select tenant choice
  useEffect(() => {
    if (tenantChoice?.value === TenantChoiceEnum.existingTenant) {
      setIsCheckInExistingTenant(true);
      setIsCheckInNewTenant(false);
    } else if (tenantChoice?.value === TenantChoiceEnum.newTenant) {
      setIsCheckInNewTenant(true);
      setIsCheckInExistingTenant(false);
    } else {
      setIsCheckInNewTenant(false);
      setIsCheckInExistingTenant(false);
    }
  }, [tenantChoice]);

  // set a list of currency names
  useEffect(() => {
    const currencyName = Object.keys(currencyState);
    setCurrencyNames(currencyName);
  }, [currencyState]);

  // set the converted money
  useEffect(() => {
    const facilityCurrency = String(accommodation?.facility.preferedCurrency);
    setConvertedPrice(
      convertCurrency(
        currencyState,
        desiredCurrency,
        facilityCurrency,
        Number(accommodation?.price)
      )
    );
  }, [
    currencyState,
    desiredCurrency,
    accommodation?.facility.preferedCurrency,
    accommodation?.price,
  ]);

  // fetch accommodation rent records
  useEffect(() => {
    dispatch(
      fetchAccommodationRent({
        accommodationId: Number(accommodation?.accommodationId),
        page: 0,
        size: 15,
      })
    );
  }, [accommodation?.accommodationId, dispatch]);

  // filter rent records
  useEffect(() => {
    const originalAccommodationRent =
      accommodationRent.length > 0
        ? [...accommodationRent].sort((a, b) => {
            const aRentId = a.rentId ? parseInt(String(a.rentId), 10) : 0;
            const bRentId = b.rentId ? parseInt(String(b.rentId), 10) : 0;
            return bRentId - aRentId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredAccommodationRent(originalAccommodationRent);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredAccommodationRent(
        originalAccommodationRent.filter((rent) => {
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
  }, [searchString, accommodationRent]);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-accommodation/${Number(
          accommodation?.accommodationId
        )}/${page + 1}/${size}`
      );
      dispatch(resetAccommodationRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, accommodation?.accommodationId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-rent-by-accommodation/${Number(
          accommodation?.accommodationId
        )}/${page - 1}/${size}`
      );
      dispatch(resetAccommodationRent(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH RENT CANCELLED ", error.message);
      }
      console.error("Error fetching rent: ", error);
    }
  }, [dispatch, page, size, accommodation?.accommodationId]);

  // handle delete accommodation
  const handleDeleteAccommodation = useCallback(async () => {
    try {
      const results = await deleteData(
        `/delete-accommodation/${Number(accommodation?.accommodationId)}`
      );

      if (results.data.status && results.data.status !== "OK") {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: (await results).data.message,
          })
        );

        return;
      }

      dispatch(deleteAccommodation(Number(accommodation?.accommodationId)));

      const socketMessage: SocketMessageModel = {
        userId: Number(currentUser.userId),
        userRole: String(currentUser.userRole),
        content: String(accommodation?.accommodationId),
        activity: UserActivity.deleteAccommodation,
      };

      webSocketService.sendMessage("/app/delete-accommodation", socketMessage);

      toggleShowAccommodationDetails();
      dispatch(setConfirm({ message: "", status: false }));
      dispatch(
        setAlert({
          message: results.data.message,
          status: true,
          type: AlertTypeEnum.success,
        })
      );

      navigate(`/facilities/${accommodation?.facility.facilityId}`);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log();
      }
    }
  }, [
    accommodation?.facility.facilityId,
    accommodation?.accommodationId,
    dispatch,
    navigate,
    toggleShowAccommodationDetails,
  ]);

  // conditional rendering if on loading
  if (status === "loading") return <Preloader />;

  // conditional rendering if show rent form is true
  if (showRentForm)
    return (
      <RentForm
        facilityId={accommodation?.facility.facilityId}
        accommodation={accommodation}
        setShowRentForm={setShowRentForm}
      />
    );

  // conditional rendering is check in new tenant is true
  if (isCheckInNewTenant)
    return (
      <div className="w-full text-black bg-gray-100 p-5">
        <div className="w-full flex justify-between items-center text-3xl p-2 sticky top-0 z-20 bg-white">
          <p className="w-3/4 text-center">Add new tenant</p>
          <span
            className="lg:hover:bg-red-600 lg:hover:text-white p-1 rounded-lg cursor-pointer"
            onClick={() => {
              setIsCheckInNewTenant(false);
              setTenantChoice({ label: "", value: "" });
            }}
          >
            <RxCross2 />
          </span>
        </div>
        <div className="w-full h-full flex justify-center items-center">
          <TenantForm
            facilityId={Number(accommodation?.facility.facilityId)}
            accommodationId={Number(accommodation?.accommodationId)}
            unitNumber={accommodation?.accommodationNumber}
            unitType={accommodation?.accommodationType}
            setIsCheckInExistingTenant={setIsCheckInExistingTenant}
            setTenantChoice={setTenantChoice}
            setTenants={setTenants}
            setIsCheckInNewTenant={setIsCheckInNewTenant}
          />
        </div>
      </div>
    );

  // conditional rendering if check in existing tenant is true
  if (isCheckInExistingTenant)
    return (
      <div className="w-full h-[calc(100vh-115px)] pb-10 bg-gray-100">
        <div className="w-full flex justify-end items-center text-3xl p-2 sticky top-0">
          <span
            className="bg-pay-200 p-1 rounded-lg lg:hover:bg-red-500 lg:hover:text-white cursor-pointer border border-gray-400"
            onClick={() => {
              setIsCheckInExistingTenant(false);
              setTenantChoice({ label: "", value: "" });
            }}
          >
            <RxCross2 />
          </span>
        </div>
        <div className="w-full h-full flex justify-center items-center">
          <TenantIdForm
            facilityId={Number(accommodation?.facility.facilityId)}
            accommodationId={Number(accommodation?.accommodationId)}
            unitNumber={accommodation?.accommodationNumber}
            unitType={accommodation?.accommodationType}
            setIsCheckInExistingTenant={setIsCheckInExistingTenant}
            setTenantChoice={setTenantChoice}
            setTenants={setTenants}
          />
        </div>
      </div>
    );

  return (
    <div className="w-full h-fit p-0 relative">
      <div className="w-full lg:w-full m-auto h-full border">
        <div className="w-full p-2 flex justify-between items-center sticky top-0  border-b-2 border-gray-300 z-10 bg-white">
          <h1 className="text-lg font-bold">
            {accommodation?.accommodationNumber}
          </h1>
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
            className="p-1 lg:hover:bg-red-600 lg:hover:text-white text-3xl rounded-sm cursor-pointer"
            onClick={() => {
              toggleShowAccommodationDetails();
              navigate(`/facilities/${accommodation?.facility.facilityId}`);
            }}
          />
        </div>
        <div className="w-full h-full flex flex-wrap justify-between items-start py-10">
          <div className="w-full lg:w-1/3 px-3">
            {/* accommodation section */}
            <div className="p-4 w-full">
              <h2 className="text-xl font-bold">Unit details</h2>
              <div className="p-2 flex justify-start items-center w-full">
                <p className="text-sm flex flex-wrap px-3">
                  <span className="w-full">
                    <b>ID: </b>
                    <span>{"ACC-" + accommodation?.accommodationId}</span>
                  </span>
                  <span className="w-full">
                    <b>Number: </b>
                    <span>{accommodation?.accommodationNumber}</span>
                  </span>
                  <span className="w-full">
                    <b>Floor: </b>
                    <span>{accommodation?.floor}</span>
                  </span>
                  <span className="w-full">
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
                    <span className="w-full">
                      <b>Category: </b>
                      <span>
                        {
                          ACCOMMODATION_CATEGORY.find(
                            (category) =>
                              category.value ===
                              accommodation?.accommodationCategory
                          )?.label
                        }
                      </span>
                    </span>
                  )}

                  {accommodation?.capacity && (
                    <span className="w-full">
                      <b>Capacity: </b>
                      <span>{accommodation?.capacity}</span>
                    </span>
                  )}

                  <span className="w-full">
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
                      )}{" "}
                      /{" "}
                      {
                        PAYMENT_PARTERN.find(
                          (parttern) =>
                            parttern.value === accommodation?.paymentPartten
                        )?.label
                      }
                    </span>
                  </span>
                  <span className="w-full">
                    <b>Status: </b>
                    <span>
                      {Number(tenants?.length) >=
                      Number(accommodation?.capacity)
                        ? AccommodationAvailability.occupied
                        : accommodation?.availability}
                    </span>
                  </span>

                  <div className="py-3 flex justify-around w-3/4">
                    <button
                      className="w-24 py-1 px-3 bg-blue-300 hover:bg-blue-700 hover:text-white rounded-sm"
                      onClick={() => setShowForm(true)}
                    >
                      Edit
                    </button>
                    <button
                      className="w-24 py-1 px-3 bg-red-300 hover:bg-red-700 hover:text-white rounded-sm"
                      onClick={() => {
                        dispatch(
                          setConfirm({
                            message: `Are you sure you want to delete this unit (${accommodation?.accommodationType} ${accommodation?.accommodationNumber})?`,
                            status: true,
                          })
                        );
                        dispatch(
                          setUserAction({
                            userAction: () => handleDeleteAccommodation(),
                          })
                        );
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </p>
              </div>
            </div>

            {/* tenants section*/}
            <div className="p-4 w-full pt-14">
              <h2 className="text-xl font-bold">
                Tenant(s){" "}
                {accommodation?.availability ===
                  AccommodationAvailability.available && (
                  <select
                    className="ml-5 px-2 text-sm bg-gray-900 text-white lg:hover:bg-gray-500 cursor-pointer"
                    value={tenantChoice.value}
                    onChange={(e) => {
                      const foundChoice = TENANT_CHOICES.find(
                        (choice) => choice.value === e.target.value
                      );
                      setTenantChoice(foundChoice || { label: "", value: "" });
                    }}
                  >
                    <option value={tenantChoice?.value || ""}>
                      CheckIn tenant
                    </option>
                    {TENANT_CHOICES.map((choice) => (
                      <option value={choice.value} key={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                )}
              </h2>

              {tenants?.map((tnt, index) => (
                <div className="p-2 flex flex-wrap justify-start items-center w-full my-2 relative">
                  <p className="flex justify-between items-center">
                    <span className="p-3 my-5 h-5 w-5 flex justify-around items-center text-lg font-bold bg-gray-800 text-white rounded-full text-center">
                      {index + 1}
                    </span>
                    <span className="px-2 py-1 text-gray-500 bg-gray-100 text-sm rounded-full font-light ">
                      {parseISO(
                        String(
                          tenantHistory.length > 0
                            ? tenantHistory?.find(
                                (history) =>
                                  history.tenant.tenantId === tnt.tenantId
                              )?.checkIn
                            : tnt.dateCreated
                        )
                      ).toDateString()}
                    </span>
                  </p>
                  <p className="text-sm flex flex-wrap">
                    <span className="w-full">
                      <b>No: </b>

                      <span>{"TNT-" + tnt.tenantId}</span>
                    </span>
                    <span className="w-full">
                      <b>Name: </b>
                      <span>
                        {tnt.user.firstName + " " + tnt.user.lastName}
                      </span>
                    </span>

                    {tnt.companyName && (
                      <span className="w-full">
                        <b>Company: </b>

                        <span>{tnt.companyName}</span>
                      </span>
                    )}
                    <span className="w-full">
                      <b>Tel: </b>
                      <span>{tnt.user.userTelephone}</span>
                    </span>

                    <span className="w-full">
                      <b>Email: </b>
                      <span>{tnt.user.userEmail}</span>
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
                              )}/${Number(tnt.tenantId)}`,
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

                            setTenants(
                              tenants.filter(
                                (tenant) => tenant.tenantId !== tnt.tenantId
                              )
                            );

                            dispatch(
                              setAlert({
                                type: AlertTypeEnum.success,
                                status: true,
                                message: result.data.message,
                              })
                            );

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
                            message: `Are you sure you want to check out tenant (TNT-${tnt.tenantId}) from Unit (${accommodation?.accommodationNumber}) of facility (FAC-${accommodation?.facility.facilityId}) `,
                            status: true,
                          })
                        );
                      }}
                    >
                      Check out
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* accommodation rent records*/}
          <div className="w-full lg:w-2/3 py-5 lg:py-0 relative h-[calc(100vh-200px)] border">
            <div className="flex justify-around items-center w-full py-5 lg-py-0">
              <h2 className=" text-center font-bold text-xl">
                Payment records
              </h2>

              <button
                className="py-1 px-5 bg-blue-700 text-white lg:hover:bg-blue-400 text-sm"
                onClick={() => setShowRentForm(true)}
              >
                Add payment
              </button>
            </div>
            <div className="flex w-full items-center justify-end px-10 py-2 lg:py-3">
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
            <div className="lg:pb-12 h-[calc(100vh-450px)] overflow-auto">
              <table className="w-full px-1 text-center text-sm bg-cyan-50">
                <thead className="bg-blue-900 text-white sticky top-0">
                  <tr className="border-y-blue-500">
                    <th className="text-white">No.</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Payment type</th>
                    <th>Bal</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody className="">
                  {filteredAccommodationRent.map((fr, index) => (
                    <AccommodationRentRow key={index} rent={fr} />
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

export default AccommodationDetails;
