import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BookingCreationModel } from "./BookingModel";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import { AppDispatch } from "../../../app/store";
import { setUserAction } from "../../../global/actions/actionSlice";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { postData } from "../../../global/api";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { PaymentTypeEnum } from "../../../global/enums/paymentTypeEnum";
import { TransactionStatusEnum } from "../../../global/enums/transactionStatusEnum";
import {
  ACCOMMODATION_TYPE_DATA,
  ACCOMMODATION_CATEGORY,
  PAYMENT_TYPE_DATA,
} from "../../../global/PreDefinedData/PreDefinedData";
import { setAlert } from "../../../other/alertSlice";
import { setConfirm } from "../../../other/ConfirmSlice";
import { UserModel } from "../../users/models/userModel";
import { FacilitiesModel } from "../FacilityModel";
import { getAvailableAccommodations } from "../accommodations/accommodationsSlice";
import SearchableSelect from "../../../global/SearchableSelect";

interface Props {
  facility: FacilitiesModel;
  setIsShowBookingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

let BookingForm: React.FC<Props> = ({ facility, setIsShowBookingForm }) => {
  const [bookingData, setBookingData] = useState<BookingCreationModel>({
    amount: null,
    currency: "",
    paymentType: null,
    checkIn: "",
    checkOut: "",
    transactionDate: String(new Date()),
    transactionStatus: TransactionStatusEnum.pending,
    accommodation: { accommodationId: null },
  });

  const [accommodationPrice, setAccommodationPrice] = useState<number>(0);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const availableUnits = useSelector(getAvailableAccommodations);

  const handleSelectChange = (option: any) => {
    setBookingData((prev) => ({
      ...prev,
      paymentType: option.value,
    }));
  };

  // const bookingAmount =
  //   (Number(accommodation?.price) *
  //     Number(accommodation?.facility.bookingPercentage)) /
  //   100;

  // SET THE DEFAULT BOOKING DATA
  // useEffect(() => {
  //   if (accommodation) {
  //     setBookingData((prev) => ({
  //       ...prev,
  //       amount:
  //         (Number(accommodation.price) *
  //           Number(accommodation.facility.bookingPercentage)) /
  //         100,
  //       currency: accommodation.facility.preferedCurrency,
  //       paymentType: PaymentTypeEnum.others,
  //       accommodationType: String(accommodation.accommodationType),
  //       accommodationCategory: accommodation.accommodationCategory
  //         ? String(accommodation.accommodationCategory)
  //         : null,
  //       transactionDate: String(new Date().toISOString()),
  //       transactionStatus: TransactionStatusEnum.pending,
  //       facility: {
  //         facilityId: Number(accommodation.facility?.facilityId || 0),
  //       },
  //     }));
  //   }
  // }, [accommodation]);

  // submit the accommodation booking
  const submitBooking = async () => {
    const currentUSer: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

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
      const result = await postData(
        `/book-accommodation-by-tenant/${Number(currentUSer.userId)}`,
        bookingData
      );

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
          message: result.data.message,
        })
      );

      navigate("/bookings");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("BOOKING CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ status: false, message: "" }));
    }
  };

  return (
    <div className="w-full h-100vh overflow-auto bg-gray-100">
      <div className="p-5 bg-white flex justify-around w-full shadow-lg">
        <h1 className="text-2xl w-5/6 text-center text-gray-700 font-bold">
          Add new booking
        </h1>
        <h1
          className="text-2xl text-bold p-2 lg:hover:bg-red-500 lg:hover:text-white cursor-pointer"
          onClick={() => setIsShowBookingForm(false)}
        >
          <RxCross1 />
        </h1>
      </div>

      <div className="py-10 flex flex-wrap justify-center w-full  h-[calc(100vh-200px)] overflow-auto">
        <h2 className="text-xl text-gray-600 w-full text-center py-5">
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

        <form
          className="w-full lg:w-1/3 m-auto p-5 border"
          onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <div className="form-group w-full">
            <label htmlFor="checkOut" className="w-full text-sm">
              Unit
              <span className="text-red-600"> *</span>
            </label>

            <select
              name="paymentMethod"
              id="paymentMethod"
              className="w-full"
              onChange={(e) => {
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
                  } ${unit.floor}`}
                </option>
              ))}
            </select>

            <small className="w-full"></small>
          </div>

          <div className="form-group w-full py-5">
            <label htmlFor="amount" className="w-full text-sm">
              Amount <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="w-full"
              value={bookingData.amount || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookingData((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
                }))
              }
            />
            <small className="w-full"></small>
          </div>

          <div className="form-group w-full py-5">
            <label htmlFor="checkIn" className="w-full text-sm">
              Expected checkIn <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="checkIn"
              name="CheckIn"
              className="w-full"
              value={bookingData.checkIn}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookingData((prev) => ({ ...prev, checkIn: e.target.value }))
              }
            />
            <small className="w-full"></small>
          </div>

          <div className="form-group w-full py-5">
            <label htmlFor="checkOut" className="w-full text-sm">
              Expected checkOut <span className="text-red-600"></span>
            </label>
            <input
              type="date"
              id="checkOut"
              name="CheckOut"
              className="w-full"
              value={bookingData.checkOut}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookingData((prev) => ({
                  ...prev,
                  checkOut: e.target.value,
                }))
              }
            />
            <small className="w-full"></small>
          </div>

          <div className="form-group w-full py-5">
            <label htmlFor="checkOut" className="w-full text-sm">
              Payment method <span className="text-red-600">*</span>
            </label>

            <SearchableSelect
              options={PAYMENT_TYPE_DATA}
              onChange={handleSelectChange}
              id="paymentType"
              name="paymentType"
              placeholder="Select payment method"
            />
            <small className="w-full"></small>
          </div>

          <div className="form-group w-full py-10 flex items-center justify-center">
            <button
              type="submit"
              className="w-full px-10 py-2 text-2xl bg-blue-500 lg:hover:bg-blue-300 text-white"
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
