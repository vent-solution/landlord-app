import React, { useState } from "react";
import { CreationRentModel } from "./RentModel";
import { RxCross1 } from "react-icons/rx";
import { PaymentTypeEnum } from "../../../global/enums/paymentTypeEnum";
import axios from "axios";
import { postData } from "../../../global/api";
import { UserModel } from "../../users/models/userModel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setAlert } from "../../../other/alertSlice";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { setConfirm } from "../../../other/ConfirmSlice";
import { setUserAction } from "../../../global/actions/actionSlice";
import { addTenantRent } from "../tenants/TenantRentSlice";
import { AddAccommodationRent } from "../accommodations/AccommodationRentSlice";
import { AccommodationModel } from "../accommodations/AccommodationModel";
import convertCurrency from "../../../global/actions/currencyConverter";
import { getCurrencyExchange } from "../../../other/apis/CurrencyExchangeSlice";

interface Props {
  tenantId?: number;
  facilityId?: number;
  accommodation?: AccommodationModel;
  setShowRentForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const INITIAL_RENT_DATA: CreationRentModel = {
  price: null,
  amount: null,
  dollarRate: null,
  facilityCurrencyRate: null,
  currency: null,
  paymentType: null,
  transactionDate: null,
  transactionStatus: null,
  dateCreated: null,
  lastUpdated: null,
  tenant: { tenantId: null },
  accommodation: { accommodationId: null, accommodationNumber: null },
};

let RentForm: React.FC<Props> = ({
  tenantId,
  facilityId,
  accommodation,
  setShowRentForm,
}) => {
  const currencyState = useSelector(getCurrencyExchange);

  const [rentData, setRentData] = useState<CreationRentModel>({
    ...INITIAL_RENT_DATA,
    price: Number(accommodation?.price),
    dollarRate: currencyState["usd"],
    facilityCurrencyRate:
      currencyState[String(accommodation?.facility.preferedCurrency)],

    currency: String(accommodation?.facility.preferedCurrency),
    accommodation: {
      accommodationId: Number(accommodation?.accommodationId),
      accommodationNumber: String(accommodation?.accommodationNumber),
    },
    tenant: { tenantId: Number(tenantId) },
  });

  const paymentType: { label: string; value: string }[] = [
    { label: "Cash", value: PaymentTypeEnum.cash },
    { label: "Cheque", value: PaymentTypeEnum.cheque },
    { label: "Bank", value: PaymentTypeEnum.bank },
  ];

  const dispatch = useDispatch<AppDispatch>();

  // check if all required form field values are provided
  const canSave =
    rentData.amount &&
    rentData.currency &&
    rentData.paymentType &&
    rentData.transactionDate &&
    rentData.tenant?.tenantId &&
    (rentData.accommodation?.accommodationId ||
      rentData.accommodation?.accommodationNumber);

  // handle save rent payment
  const handleSaveRentPayment = async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    // check if correct checkIn date is provided
    if (
      new Date(String(rentData.transactionDate)).getTime() >
      new Date().getTime()
    ) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message:
            "Invalid transaction date. A transaction can not be completed in a future date or time!",
        })
      );

      return;
    }

    try {
      const result = await postData(
        `/add-new-rent/${currentUser.userId}`,
        rentData
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

      dispatch(addTenantRent(result.data));

      dispatch(AddAccommodationRent(result.data));

      dispatch(
        setAlert({
          type: AlertTypeEnum.success,
          status: true,
          message: "Rent payment has been saved successfully.",
        })
      );

      setShowRentForm(false);
      // navigate("/receipts");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("SAVE RENT PAYMENT CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ status: false, message: "" }));
    }
  };

  return (
    <div className="w-full py-5 mt-16 lg:mt-0">
      <form
        className="w-full lg:w-1/2 m-auto p-10 bg-gray-50 border relative"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
      >
        <h1
          className="text-xl absolute right-2 top-2 p-2 lg:hover:bg-red-600 lg:hover:text-white cursor-pointer"
          onClick={() => setShowRentForm(false)}
        >
          <RxCross1 />
        </h1>
        <h1 className="text-2xl w-full font-bold py-5">Add rent payment</h1>

        {/* tenant number form field */}
        {!tenantId && (
          <div className="form-group w-full text-sm py-3">
            <label htmlFor="" className="font-bold">
              Tenant number <span className="text-red-600">*</span>
            </label>

            <select
              id="tenantId"
              className="w-full outline-none border border-gray-600 rounded-lg focus:border-blue-500"
              onChange={(e) =>
                setRentData((prev) => ({
                  ...prev,
                  tenant: { tenantId: Number(e.target.value) },
                }))
              }
            >
              <option value="">SELECT TENANT</option>

              {accommodation?.tenants?.map((tenant) => (
                <option value={tenant.tenantId}>
                  TNT-{tenant.tenantId}{" "}
                  {tenant.user.firstName + " " + tenant.user.lastName}
                </option>
              ))}
            </select>
            <small></small>
          </div>
        )}

        {/* unit number or accommondation number form field */}
        {!accommodation?.accommodationId &&
          !accommodation?.accommodationNumber && (
            <div className="form-group w-full text-sm py-3">
              <label htmlFor="" className="font-bold">
                Unit number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="accommodationId"
                placeholder="Enter tenant number (eg. G01, 104, 4F02)"
                className="w-full outline-none border border-gray-600 rounded-lg focus:border-blue-500"
                onChange={(e) =>
                  setRentData((prev) => ({
                    ...prev,
                    accommodation: {
                      accommodationId: Number(accommodation?.accommodationId),
                      accommodationNumber: e.target.value,
                    },
                  }))
                }
              />
              <small></small>
            </div>
          )}

        {/* facility number form field */}
        {!facilityId && (
          <div className="form-group w-full text-sm py-3">
            <label htmlFor="" className="font-bold">
              Facility number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter tenant number (eg. FAC-11)"
              className="w-full outline-none border border-gray-600 rounded-lg focus:border-blue-500"
              onChange={(e) =>
                setRentData((prev) => ({
                  ...prev,
                  facility: { facilityId: Number(e.target.value.slice(3)) },
                }))
              }
            />
            <small></small>
          </div>
        )}

        {/* rent amount */}
        <div className="form-group w-full text-sm py-3">
          <label htmlFor="" className="font-bold">
            Amount ({accommodation?.facility.preferedCurrency}){" "}
            <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            placeholder="Enter amount (eg. 23030000)"
            className="w-full outline-none border border-gray-600 rounded-lg focus:border-blue-500"
            onChange={(e) =>
              setRentData((prev) => ({
                ...prev,
                amount: convertCurrency(
                  currencyState,
                  "usd",
                  String(accommodation?.facility.preferedCurrency),
                  Number(e.target.value)
                ),
              }))
            }
          />
          <small></small>
        </div>

        {/* payment type*/}
        <div className="form-group w-full text-sm py-3">
          <label htmlFor="" className="font-bold">
            Payment type <span className="text-red-600">*</span>
          </label>

          <select
            name=""
            id=""
            className="w-full outline-none border border-gray-600 rounded-lg focus:border-blue-500"
            onChange={(e) =>
              setRentData((prev) => ({ ...prev, paymentType: e.target.value }))
            }
          >
            <option value="">Enter payment type</option>

            {paymentType.map((type, index) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <small></small>
        </div>

        {/* payment date */}
        <div className="form-group w-full text-sm py-3">
          <label htmlFor="" className="font-bold">
            Payment date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            placeholder="Enter payment date"
            className="w-full outline-none border border-gray-600 rounded-lg focus:border-blue-500"
            onChange={(e) =>
              setRentData((prev) => ({
                ...prev,
                transactionDate: e.target.value,
              }))
            }
          />
          <small></small>
        </div>

        {/* action buttons */}
        <div className="form-group w-full text-sm py-3 flex justify-around items-center ">
          <input
            type="submit"
            value={"Save"}
            className="w-1/3 outline-none border bg-blue-600 text-white lg:hover:bg-blue-400 cursor-pointer border-gray-600 rounded-lg focus:border-blue-500"
            onClick={() => {
              if (!canSave) {
                dispatch(
                  setAlert({
                    type: AlertTypeEnum.danger,
                    status: true,
                    message:
                      "Please fill in all the required fields marked by (*)",
                  })
                );

                return;
              }
              dispatch(setUserAction({ userAction: handleSaveRentPayment }));

              const actualAmount = convertCurrency(
                currencyState,
                String(accommodation?.facility.preferedCurrency),
                "usd",
                Number(rentData.amount)
              );

              dispatch(
                setConfirm({
                  status: true,
                  message: `Are you sure you want to save rent payment TENAT: (TNT-${
                    rentData.tenant?.tenantId
                  }), FACILITY: (FAC-${facilityId}), UNIT: (${
                    rentData.accommodation?.accommodationNumber
                  }), AMOUNT: ${
                    accommodation?.facility.preferedCurrency +
                    ". " +
                    actualAmount
                  }`,
                })
              );
            }}
          />

          <input
            type="submit"
            value={"Cancel"}
            className="w-1/3 outline-none border bg-gray-100 lg:hover:bg-gray-50 cursor-pointer border-gray-600 rounded-lg focus:border-blue-500"
            onClick={() => setShowRentForm(false)}
          />
        </div>
      </form>
    </div>
  );
};

RentForm = React.memo(RentForm);

export default RentForm;
