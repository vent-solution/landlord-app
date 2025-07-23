import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { BookingCreationModel } from "./BookingModel";
import { AppDispatch } from "../../../app/store";
import { setUserAction } from "../../../global/actions/actionSlice";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { fetchData, postData } from "../../../global/api";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { PaymentTypeEnum } from "../../../global/enums/paymentTypeEnum";
import { TransactionStatusEnum } from "../../../global/enums/transactionStatusEnum";
import {
  ACCOMMODATION_TYPE_DATA,
  ACCOMMODATION_CATEGORY,
  PAYMENT_TYPE_DATA,
  PAYMENT_PARTERN,
} from "../../../global/PreDefinedData/PreDefinedData";
import { setAlert } from "../../../other/alertSlice";
import { setConfirm } from "../../../other/ConfirmSlice";
import { FacilitiesModel } from "../FacilityModel";
import SearchableSelect from "../../../global/SearchableSelect";
import { addNewFacilityBooking } from "./bookingsSlice";
import checkRequiredFormFields from "../../../global/validation/checkRequiredFormFields";
import markRequiredFormField from "../../../global/validation/markRequiredFormField";
import NewTenantForm from "./NewTenantForm";
import { AccommodationModel } from "../accommodations/AccommodationModel";

interface Props {
  facility: FacilitiesModel;
  setIsShowBookingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

let BookingForm: React.FC<Props> = ({ facility, setIsShowBookingForm }) => {
  const [isNewTenant, setIsNewTenant] = useState(false);
  const [bookingData, setBookingData] = useState<BookingCreationModel>({
    amount: null,
    currency: facility.preferedCurrency,
    paymentType: null,
    checkIn: "",
    checkOut: "",
    transactionDate: String(new Date()),
    transactionStatus: TransactionStatusEnum.pending,
    accommodation: { accommodationId: null },
    tenant: { tenantId: null },
  });

  const [accommodationPrice, setAccommodationPrice] = useState<number>(0);

  const canSubmit =
    bookingData.amount &&
    bookingData.currency &&
    bookingData.paymentType &&
    bookingData.checkIn &&
    bookingData.accommodation.accommodationId &&
    bookingData.tenant.tenantId;

  const dispatch = useDispatch<AppDispatch>();

  const [availableUnits, setAvailableUnits] = useState<AccommodationModel[]>(
    []
  );

  const handleSelectChange = (option: any) => {
    setBookingData((prev) => ({
      ...prev,
      paymentType: option.value,
    }));
  };

  // fetch available units for booking
  useEffect(() => {
    const fetchAvailableUnits = async () => {
      const today = new Date().toISOString().split("T")[0];

      if (bookingData.checkOut && today > String(bookingData.checkOut)) {
        markRequiredFormField(
          document.getElementById("checkOut") as HTMLInputElement
        );
        dispatch(
          setAlert({
            message: "Invalid date. You can not choose a passed date",
            status: true,
            type: AlertTypeEnum.danger,
          })
        );
        return;
      }

      if (bookingData.checkIn && today > String(bookingData.checkIn)) {
        markRequiredFormField(
          document.getElementById("checkIn") as HTMLInputElement
        );
        dispatch(
          setAlert({
            message: "Invalid date. You can not choose a passed date",
            status: true,
            type: AlertTypeEnum.danger,
          })
        );
        return;
      }

      if (
        bookingData.checkOut &&
        String(bookingData.checkIn) > String(bookingData.checkOut)
      ) {
        dispatch(
          setAlert({
            message:
              "Invalid dates. Check in date can not be higher than the check out date",
            status: true,
            type: AlertTypeEnum.danger,
          })
        );
        return;
      }

      if (
        (Number(bookingData.checkIn?.trim().length) < 10 &&
          Number(bookingData.checkOut?.trim().length) < 10) ||
        (Number(bookingData.checkIn?.trim().length) < 10 &&
          Number(bookingData.checkOut?.trim().length) >= 10) ||
        (Number(bookingData.checkIn?.trim().length) >= 10 &&
          Number(bookingData.checkOut?.trim().length) < 10)
      ) {
        return;
      }

      try {
        const result = await fetchData(
          `/fetch-available-units-for-booking/${Number(facility.facilityId)}/${
            bookingData.checkIn
          }/${bookingData.checkOut}`
        );

        if (!result || result.status === 404) {
          dispatch(
            setAlert({
              message: "Internal server error!",
              status: true,
              type: AlertTypeEnum.danger,
            })
          );

          return;
        }

        if (result.data.status && result.data.status !== "OK") {
          dispatch(
            setAlert({
              message: result.data.message,
              status: true,
              type: AlertTypeEnum.danger,
            })
          );

          return;
        }

        setAvailableUnits(result.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH AVAILABLE UNITS CANCELED: ", error.message);
        }
      }
    };

    fetchAvailableUnits();
  }, [facility.facilityId, bookingData.checkIn, bookingData.checkOut]);

  // submit the accommodation booking
  const submitBooking = async () => {
    // check required fields before submitting data
    if (!canSubmit) {
      checkRequiredFormFields([
        document.getElementById("tenantId") as HTMLInputElement,
        document.getElementById("amount") as HTMLInputElement,
        document.getElementById("paymentType") as HTMLInputElement,
        document.getElementById("checkIn") as HTMLInputElement,
      ]);
      checkRequiredFormFields([
        document.getElementById("accommodationId") as HTMLSelectElement,
      ]);

      dispatch(setConfirm({ message: "", status: false }));

      dispatch(
        setAlert({
          message: "Please fill in all the required fields marked by *",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );

      return;
    }

    // check if checkIn date is provided
    if (String(bookingData.checkIn).trim().length < 1) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Please choose expected checkIn date.",
        })
      );

      return;
    }

    // check if payment method is selected
    if (
      String(bookingData.paymentType) === PaymentTypeEnum.others &&
      Number(bookingData?.amount) > 0
    ) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Please select a payment method.",
        })
      );

      return;
    }

    // check if correct checkIn date is provided
    if (
      new Date(String(bookingData.checkIn)).getTime() < new Date().getTime()
    ) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Please select a current or future checkIn date.",
        })
      );

      return;
    }

    try {
      const result = await postData(`/add-new-booking`, bookingData);

      if (!result) {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            status: true,
            message: "ERROR OCCURRED PLEASE TRY AGAIN!!",
          })
        );
        return;
      }

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            status: true,
            message: result.data.message,
          })
        );

        return;
      }

      if (result.status !== 200) {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
            message: "Error occurred please try again.",
          })
        );
        return;
      }

      dispatch(
        setAlert({
          type: AlertTypeEnum.success,
          status: true,
          message: "Booking has been added successfully!",
        })
      );

      dispatch(addNewFacilityBooking(result.data));

      setIsShowBookingForm(false);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("BOOKING CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ status: false, message: "" }));
    }
  };

  if (isNewTenant) {
    return (
      <div className="w-full flex flex-wrap justify-center h-[calc(100vh-130px)] overflow-auto p-0 lg:p-5 bg-gray-200">
        <NewTenantForm
          setIsNewTenant={setIsNewTenant}
          setBookingData={setBookingData}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-100vh overflow-auto bg-gray-200">
      <div className="py-10 flex flex-wrap justify-center w-full h-[calc(100vh-130px)] overflow-auto">
        <form
          className="w-full lg:w-1/2 m-auto p-5 border shadow-lg bg-gray-100"
          onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <div className="p-5 flex justify-between w-full">
            <h1 className="text-2xl text-center text-gray-700 font-bold">
              Add new booking
            </h1>
            <h1
              className="text-2xl text-bold p-2 lg:hover:bg-red-500 lg:hover:text-white cursor-pointer"
              onClick={() => setIsShowBookingForm(false)}
            >
              <RxCross1 />
            </h1>
          </div>
          <h2 className="text-xl text-gray-600 w-full text-start p-5">
            Minimum booking amount ({facility.bookingPercentage}%):{" "}
            <span className="text-gray-900 font-mono">
              {FormatMoney(
                (Number(accommodationPrice) *
                  Number(facility.bookingPercentage)) /
                  100,
                2,
                String(facility.preferedCurrency)
              )}
            </span>
          </h2>
          {/* show new tenant form  */}
          <div className="py-5 flex justify-between items-center">
            <button
              className="bg-blue-600 text-white p-3 rounded-md lg:hover:bg-blue-400 lg:active:scale-95"
              onClick={() => setIsNewTenant(!isNewTenant)}
            >
              Add new tenant
            </button>
            {bookingData.tenant.tenantId && (
              <h1 className="text-2xl font-bold uppercase">{`tnt-${bookingData.tenant.tenantId}`}</h1>
            )}
          </div>

          {/* tenant */}
          <div className="form-group w-full pt-5">
            <label htmlFor="tenantId" className="w-full text-sm font-bold">
              Tenant number (eg. tnt-3) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="tenantId"
              name="tenantId"
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              // value={`tnt-${bookingData.tenant.tenantId}` || ""}
              placeholder="Enter tenant number eg. tnt-4"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                markRequiredFormField(e.target);
                setBookingData((prev) => ({
                  ...prev,
                  tenant: { tenantId: Number(e.target.value.slice(4)) },
                }));
              }}
            />
            <small className="w-full text-red-500">
              Tenant number is required!
            </small>
          </div>

          {/* expected check in */}
          <div className="form-group w-full pt-5">
            <label htmlFor="checkIn" className="w-full text-sm font-bold">
              Expected checkIn <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="checkIn"
              name="CheckIn"
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              value={bookingData.checkIn || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                markRequiredFormField(e.target);

                setBookingData((prev) => ({
                  ...prev,
                  checkIn: e.target.value,
                }));
              }}
            />
            <small className="w-full text-red-500">
              Expected check in is required!
            </small>
          </div>

          <div className="form-group w-full py-5 ">
            <label htmlFor="checkOut" className="w-full text-sm font-bold">
              Expected checkOut <span className="text-red-600"></span>
            </label>
            <input
              type="date"
              id="checkOut"
              name="CheckOut"
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              value={bookingData.checkOut || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookingData((prev) => ({
                  ...prev,
                  checkOut: e.target.value,
                }))
              }
            />
            <small className="w-full"></small>
          </div>

          {/* unit or room  */}
          <div className="form-group w-full pt-5">
            <label
              htmlFor="accommodationId"
              className="w-full text-sm font-bold"
            >
              Available Unit
              <span className="text-red-600"> *</span>
            </label>

            <select
              name="paymentMethod"
              id="accommodationId"
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              onChange={(e) => {
                markRequiredFormField(e.target);

                setBookingData((prev) => ({
                  ...prev,
                  accommodation: { accommodationId: Number(e.target.value) },
                }));

                setAccommodationPrice(
                  availableUnits.find(
                    (unit) => unit.accommodationId === Number(e.target.value)
                  )?.price || 0
                );
              }}
            >
              <option value="">SELECT UNIT | ROOM </option>
              {availableUnits.map((unit) => (
                <option value={unit.accommodationId}>
                  {`${unit.accommodationNumber} - ${
                    ACCOMMODATION_TYPE_DATA.find(
                      (type) => type.value === unit.accommodationType
                    )?.label
                  } ${
                    unit.accommodationCategory
                      ? "(" +
                        ACCOMMODATION_CATEGORY.find(
                          (category) =>
                            category.value === unit.accommodationCategory
                        )?.label +
                        ")"
                      : ""
                  } | ${FormatMoney(
                    Number(unit.price),
                    2,
                    String(unit.facility.preferedCurrency)
                  )}  ${
                    PAYMENT_PARTERN.find(
                      (pattern) =>
                        String(pattern.value) === String(unit.paymentPartten)
                    )?.label
                  }`}
                </option>
              ))}
            </select>

            <small className="w-full text-red-500">Unit is required!</small>
          </div>

          {/* amount  */}
          <div className="form-group w-full pt-5">
            <label htmlFor="amount" className="w-full text-sm font-bold">
              Amount{" "}
              <span className="text-red-600">
                {`(${facility.preferedCurrency})`}*
              </span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              value={bookingData.amount || ""}
              placeholder={`Enter amount in ${facility.preferedCurrency}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                markRequiredFormField(e.target);

                setBookingData((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }));
              }}
            />
            <small className="w-full text-red-500">Amount is required!</small>
          </div>

          <SearchableSelect
            options={PAYMENT_TYPE_DATA}
            onChange={handleSelectChange}
            id="paymentType"
            name="paymentType"
            placeholder="Select payment method"
            label={"Payment method"}
          />

          <div className="form-group w-full py-10 flex items-center justify-center">
            <button
              type="submit"
              className="w-full px-10 py-2 text-2xl bg-blue-600 lg:hover:bg-blue-400 text-white lg:active:scale-95"
              onClick={() => {
                dispatch(
                  setConfirm({
                    status: true,
                    message: `Are you sure you want to submit this booking ?`,
                  })
                );

                dispatch(setUserAction({ userAction: submitBooking }));
              }}
            >
              Submit booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BookingForm = React.memo(BookingForm);

export default BookingForm;
