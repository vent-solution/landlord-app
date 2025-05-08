import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppDispatch } from "../../app/store";
import { setUserAction } from "../../global/actions/actionSlice";
import { postData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { PaymentTypeEnum } from "../../global/enums/paymentTypeEnum";
import { setAlert } from "../../other/alertSlice";
import { setConfirm } from "../../other/ConfirmSlice";
import { getSettings } from "../settings/SettingsSlice";
import { UserModel } from "../users/models/userModel";
import { FormatMoney } from "../../global/actions/formatMoney";
import { SubscriptionCreationModel } from "./SubscriptionModel";

interface Props {
  setIsShowSubscriptionForm: React.Dispatch<React.SetStateAction<boolean>>;
}

let SubscriptionForm: React.FC<Props> = ({ setIsShowSubscriptionForm }) => {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionCreationModel>({
      transactionNumber: null,
      amount: null,
      currency: null,
      paymentType: null,
      transactionDate: new Date().toISOString(),
      user: { userId: null },
    });

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const adminFinancialSettings = useSelector(getSettings);

  // SET THE DEFAULT SUBSCRIPTION DATA
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    setSubscriptionData((prev) => ({
      ...prev,
      currency: adminFinancialSettings.settings[0].preferedCurrency,
      transactionDate: String(new Date().toISOString()),
      user: { userId: Number(currentUser.userId) },
    }));
  }, [adminFinancialSettings.settings]);

  // submit the facility service fee
  const submitSubscription = async () => {
    const currentUSer: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    // check if amount is provided
    if (!subscriptionData.amount) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "Invalid subscription amount!",
        })
      );

      return;
    }

    // check if currency is set
    if (!subscriptionData.currency) {
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

    // check if user is set
    if (!subscriptionData.user?.userId) {
      dispatch(setConfirm({ status: false, message: "" }));
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          status: true,
          message: "User is required!",
        })
      );

      return;
    }

    // check if payment method is selected;
    if (!subscriptionData.paymentType) {
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
        `/pay-subscription/${Number(currentUSer.userId)}`,
        subscriptionData
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
        console.log("PAY SUBSCRIPTION CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ status: false, message: "" }));
    }
  };

  return (
    <div className="w-full h-[calc(100vh)] overflow-auto bg-gray-100">
      <div className="p-5 bg-white flex justify-end w-full shadow-lg sticky top-0">
        <h1 className="text-2xl w-full text-center text-gray-700">
          Pay subscription
        </h1>
        <h1
          className="text-2xl text-bold p-2 lg:hover:bg-red-500 lg:hover:text-white cursor-pointer"
          onClick={() => setIsShowSubscriptionForm(false)}
        >
          <RxCross1 />
        </h1>
      </div>

      <div className="py-10 flex flex-wrap justify-center w-full">
        {/* <h1 className="text-3xl font-bold w-full text-center">
          {facility?.facilityName}, {facility?.facilityLocation.city}{" "}
          {facility?.facilityLocation.country}
        </h1> */}

        <h2 className="text-xl text-green-600 w-full text-center">
          {FormatMoney(
            Number(adminFinancialSettings.settings[0].subscriptionFee),
            2,
            String(adminFinancialSettings.settings[0].preferedCurrency)
          )}
        </h2>

        <form
          className="w-full lg:w-1/3 m-auto p-5 border"
          onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <div className="form-group w-full py-5">
            <label htmlFor="amount" className="w-full text-sm">
              Amount ({adminFinancialSettings.settings[0].preferedCurrency}){" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="w-full"
              value={subscriptionData.amount || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSubscriptionData((prev) => ({
                  ...prev,
                  amount: Number(e.target.value),
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
                setSubscriptionData((prev) => ({
                  ...prev,
                  paymentType:
                    subscriptionData.paymentType !== PaymentTypeEnum.onlineMomo
                      ? PaymentTypeEnum.onlineMomo
                      : null,
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={
                  subscriptionData.paymentType === PaymentTypeEnum.onlineMomo
                }
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
                setSubscriptionData((prev) => ({
                  ...prev,
                  paymentType:
                    subscriptionData.paymentType !==
                    PaymentTypeEnum.onlineAirtelMoney
                      ? PaymentTypeEnum.onlineAirtelMoney
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={
                  subscriptionData.paymentType ===
                  PaymentTypeEnum.onlineAirtelMoney
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
                setSubscriptionData((prev) => ({
                  ...prev,
                  paymentType:
                    subscriptionData.paymentType !== PaymentTypeEnum.onlineBank
                      ? PaymentTypeEnum.onlineBank
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={
                  subscriptionData.paymentType === PaymentTypeEnum.onlineBank
                }
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
                setSubscriptionData((prev) => ({
                  ...prev,
                  paymentType:
                    subscriptionData.paymentType !==
                    PaymentTypeEnum.onlinePaypal
                      ? PaymentTypeEnum.onlinePaypal
                      : "",
                }))
              }
            >
              <input
                type="radio"
                className=" w-5 h-5"
                checked={
                  subscriptionData.paymentType === PaymentTypeEnum.onlinePaypal
                }
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
                    message: `Are you sure you want to pay subscription amounting to ${FormatMoney(
                      Number(subscriptionData.amount),
                      2,
                      adminFinancialSettings.settings[0].preferedCurrency
                    )}`,
                  })
                );

                dispatch(setUserAction({ userAction: submitSubscription }));
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

SubscriptionForm = React.memo(SubscriptionForm);

export default SubscriptionForm;
