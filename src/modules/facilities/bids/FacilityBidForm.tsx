import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";

import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../app/store";
import { setUserAction } from "../../../global/actions/actionSlice";
import { postData } from "../../../global/api";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { PaymentTypeEnum } from "../../../global/enums/paymentTypeEnum";
import { setAlert } from "../../../other/alertSlice";
import { setConfirm } from "../../../other/ConfirmSlice";
import { UserModel } from "../../users/models/userModel";
import { FacilitiesModel } from "../FacilityModel";
import axios from "axios";
import { getSettings } from "../../settings/SettingsSlice";
import { BidCreationModel } from "../../bids/BidModel";
import { FormatMoney } from "../../../global/actions/formatMoney";

interface Props {
  facility: FacilitiesModel;
  setIsShowBidForm: React.Dispatch<React.SetStateAction<boolean>>;
}

let FacilityBidForm: React.FC<Props> = ({ setIsShowBidForm, facility }) => {
  const [bidData, setBidData] = useState<BidCreationModel>({
    bidAmount: null,
    currency: null,
    paymentType: null,
    facility: { facilityId: null },
    paidBy: { userId: null },
  });

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const adminFinancialSettings = useSelector(getSettings);

  // SET THE DEFAULT SERVICE FEE DATA
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    if (facility) {
      setBidData((prev) => ({
        ...prev,
        currency: adminFinancialSettings.settings[0].preferedCurrency,
        transactionDate: String(new Date().toISOString()),
        facility: {
          facilityId: Number(facility?.facilityId),
        },
        paidBy: { userId: Number(currentUser.userId) },
      }));
    }
  }, [facility, adminFinancialSettings.settings]);

  // submit the facility service fee
  const submitFacilityServiceFee = async () => {
    const currentUSer: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    // check if amount is provided
    if (!bidData.bidAmount) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Invalid bid amount!",
        })
      );

      return;
    }

    // check if payment method is selected
    if (!bidData.currency) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Invalid currency value!",
        })
      );

      return;
    }

    // check if transaction date is provided
    // if (!facilityServiceFeeData.transactionDate) {
    //   dispatch(setConfirm({ status: false, message: "" }));
    //   dispatch(
    //     setAlert({
    //       type: AlertTypeEnum.danger,
    //       status: true,
    //       message: "Invalid transaction date.",
    //     })
    //   );

    //   return;
    // }

    // check if payment method is selected;
    if (!bidData.paymentType) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Please select a payment method and try again.",
        })
      );

      return;
    }

    try {
      const result = await postData(
        `/pay-bid/${Number(currentUSer.userId)}`,
        bidData
      );

      if (!result || result.data.status === 404) {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            status: true,
            message: "ERROR OCCURRED PLEASE TRY AGAIN.",
          })
        );

        return;
      }

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            type: AlertTypeEnum.danger,
            status: true,
            message: JSON.stringify(result.data),
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
          message: result.data,
        })
      );

      navigate("/receipts");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("PAY FACILITY SERVICE FEE CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ status: false, message: "" }));
    }
  };

  return (
    <div className="w-full h-100vh bg-gray-100">
      <div className="p-5 bg-white flex justify-end w-full shadow-lg">
        <h1 className="text-2xl w-5/6 text-center text-gray-700">
          Pay bid for {"FAC-"}
          {facility.facilityId} {facility.facilityName}
          {", "}
          {facility.facilityLocation.city} {facility.facilityLocation.country}
        </h1>
        <h1
          className="text-2xl text-bold p-2 lg:hover:bg-red-500 lg:hover:text-white cursor-pointer"
          onClick={() => setIsShowBidForm(false)}
        >
          <RxCross1 />
        </h1>
      </div>

      <div className="py-10 flex flex-wrap justify-center w-full">
        <h1 className="text-3xl font-bold w-full text-center">
          {FormatMoney(
            Number(facility.bidAmount),
            2,
            adminFinancialSettings.settings[0].preferedCurrency
          )}
        </h1>

        <h2 className="text-xl text-green-600 w-full text-center">
          {/* {FormatMoney(
            Number(price),
            2,
            String(facility.preferedCurrency)
          )} */}
        </h2>

        <form
          className="w-full lg:w-1/3 m-auto p-5 border"
          onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <div className="form-group w-full py-5">
            <label htmlFor="bidAmount" className="w-full text-sm">
              Amount ({adminFinancialSettings.settings[0].preferedCurrency}){" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="bidAmount"
              name="bidAmount"
              className="w-full"
              value={bidData.bidAmount || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBidData((prev) => ({
                  ...prev,
                  bidAmount: Number(e.target.value),
                }))
              }
            />
            <small className="w-full"></small>
          </div>

          <h3 className="pt-5 text-lg font-bold w-full underline">
            Select payment method
          </h3>

          <div className="flex flex-wrap justify-between items-center py-5">
            {/* MTN mobile money */}
            <div
              className="form-group lg:w-1/2 p-2 flex items-center hover:bg-white hover:border rounded-lg cursor-pointer "
              onClick={() =>
                setBidData((prev) => ({
                  ...prev,
                  paymentType:
                    bidData.paymentType !== PaymentTypeEnum.onlineMomo
                      ? PaymentTypeEnum.onlineMomo
                      : null,
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={bidData.paymentType === PaymentTypeEnum.onlineMomo}
              />
              <img
                src="/FILES/IMAGES/payment-method-images/mtn-momo.png"
                alt=""
                height={50}
                width={100}
              />
            </div>

            {/* Airtel money */}
            <div
              className="form-group lg:w-1/2  p-2 flex items-center hover:bg-white hover:border rounded-lg cursor-pointer"
              onClick={() =>
                setBidData((prev) => ({
                  ...prev,
                  paymentType:
                    bidData.paymentType !== PaymentTypeEnum.onlineAirtelMoney
                      ? PaymentTypeEnum.onlineAirtelMoney
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={
                  bidData.paymentType === PaymentTypeEnum.onlineAirtelMoney
                }
              />
              <img
                src="/FILES/IMAGES/payment-method-images/airtel-money.png"
                alt=""
                height={50}
                width={100}
              />
            </div>

            {/* Visa payment */}
            <div
              className="form-group lg:w-1/2  p-2 flex items-center hover:bg-white hover:border rounded-lg cursor-pointer"
              onClick={() =>
                setBidData((prev) => ({
                  ...prev,
                  paymentType:
                    bidData.paymentType !== PaymentTypeEnum.onlineBank
                      ? PaymentTypeEnum.onlineBank
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={bidData.paymentType === PaymentTypeEnum.onlineBank}
              />
              <img
                src="/FILES/IMAGES/payment-method-images/visa-payment.png"
                alt=""
                height={50}
                width={100}
              />
            </div>

            {/* paypal payment  */}
            <div
              className="form-group lg:w-1/2  p-2 flex items-center hover:bg-white hover:border rounded-lg cursor-pointer"
              onClick={() =>
                setBidData((prev) => ({
                  ...prev,
                  paymentType:
                    bidData.paymentType !== PaymentTypeEnum.onlinePaypal
                      ? PaymentTypeEnum.onlinePaypal
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={bidData.paymentType === PaymentTypeEnum.onlinePaypal}
              />
              <img
                src="/FILES/IMAGES/payment-method-images/paypal.jpeg"
                alt=""
                height={50}
                width={100}
              />
            </div>
          </div>

          <div className="form-group w-full py-10 flex items-center justify-center">
            <button
              type="submit"
              className="w-full px-10 py-2 text-xl bg-blue-500 lg:hover:bg-blue-300 text-white"
              onClick={() => {
                dispatch(
                  setConfirm({
                    status: true,
                    message: `Are you sure you want to pay bid amounting to ${bidData.bidAmount}`,
                  })
                );

                dispatch(
                  setUserAction({ userAction: submitFacilityServiceFee })
                );
              }}
            >
              Submit payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FacilityBidForm = React.memo(FacilityBidForm);

export default FacilityBidForm;
