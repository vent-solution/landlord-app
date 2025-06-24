import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { currencyNames } from "../../../other/apis/CurrencyName";
import { ExpenseCreationModel } from "./expenseModel";
import markRequiredFormField from "../../../global/validation/markRequiredFormField";
import { UserModel } from "../../users/models/userModel";
import axios from "axios";
import { postData } from "../../../global/api";
import { AppDispatch } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../../../other/alertSlice";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import { setConfirm } from "../../../other/ConfirmSlice";
import checkRequiredFormFields from "../../../global/validation/checkRequiredFormFields";
import { setUserAction } from "../../../global/actions/actionSlice";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { addNewExpense } from "./expenseSlice";
import { SocketMessageModel } from "../../../webSockets/SocketMessageModel";
import { UserActivity } from "../../../global/enums/userActivity";
import { webSocketService } from "../../../webSockets/socketService";
import { getCurrencyExchange } from "../../../other/apis/CurrencyExchangeSlice";
import { FacilitiesModel } from "../FacilityModel";

interface Props {
  toggleShowAndHideExpenseForm: () => void;
  facility: FacilitiesModel;
}

let ExpenseForm: React.FC<Props> = ({
  toggleShowAndHideExpenseForm,
  facility,
}) => {
  const [expenseData, setExpenseData] = useState<ExpenseCreationModel>({
    description: null,
    amount: null,
    currency: null,
    receiptNumber: null,
    transactionDate: null,
    facility: { facilityId: facility.facilityId },
    addedBy: { userId: null },
    dollarRate: null,
    desiredCurrencyRate: null,
    transactionCurrencyRate: null,
  });

  const currencyArray = Object.entries(currencyNames).map(([code, name]) => ({
    code,
    name,
  }));

  const dispatch = useDispatch<AppDispatch>();

  const currencyState = useSelector(getCurrencyExchange);

  // check if all required fields are filled
  const canSave =
    expenseData.description &&
    expenseData.amount &&
    expenseData.currency &&
    expenseData.transactionDate &&
    expenseData.facility.facilityId &&
    expenseData.addedBy.userId;

  // set dollar rate
  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    setExpenseData((prev) => ({
      ...prev,
      addedBy: { userId: Number(currentUser.userId) },
      dollarRate: currencyState["usd"],
    }));
  }, []);

  // handle change form fields
  const handleChangeFormField = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setExpenseData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // handle save expense
  const handleSaveExpense = async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    // check if the transaction date is valid
    const today = new Date();

    const currentDatetime = new Date(
      `${today.getFullYear()}-${
        Number(Number(today.getMonth()) + 1) > 9
          ? Number(today.getMonth()) + 1
          : "0" + Number(Number(today.getMonth()) + 1)
      }-${today.getDate() > 9 ? today.getDate() : "0" + today.getDate()}`
    ).getTime();

    const transactionTime = new Date(
      String(expenseData.transactionDate)
    ).getTime();

    if (transactionTime > currentDatetime) {
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: `Invalid transaction date.`,
        })
      );
      dispatch(setConfirm({ status: false, message: "" }));

      return;
    }

    if (!canSave) {
      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.danger,
          message: "Fill all the required fields marked by *",
        })
      );

      dispatch(setConfirm({ status: false, message: "" }));

      checkRequiredFormFields([
        document.getElementById("description") as HTMLTextAreaElement,
        document.getElementById("amount") as HTMLTextAreaElement,
        document.getElementById("currency") as HTMLTextAreaElement,
        document.getElementById("transactionDate") as HTMLTextAreaElement,
      ]);

      return;
    }

    try {
      const result = await postData("/add-new-expense", expenseData);

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            status: true,
            type: AlertTypeEnum.danger,
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
            message: "Error occurred please try again!",
          })
        );
        return;
      }

      dispatch(
        setAlert({
          status: true,
          type: AlertTypeEnum.success,
          message: `Expense has been saved successfully.`,
        })
      );

      dispatch(addNewExpense(result.data));

      setExpenseData((prev) => ({
        ...prev,
        description: null,
        amount: null,
        currency: null,
        receiptNumber: null,
        transactionDate: null,
      }));

      const socketMessage: SocketMessageModel = {
        userId: Number(currentUser.userId),
        userRole: String(currentUser.userRole),
        content: JSON.stringify(result.data),
        activity: UserActivity.addFacilityExpense,
      };

      webSocketService.sendMessage("/app/add-facility-expense", socketMessage);

      toggleShowAndHideExpenseForm();
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("ADD NEW EXPENSE CANCELLED: ", error.message);
      }
    } finally {
      dispatch(setConfirm({ status: false, message: "" }));
    }
  };

  return (
    <div className="w-full h-[calc(100vh-130px)] overflow-auto bg-gray-200 p-3 lg:p-10">
      <div className="w-full lg:w-1/2 m-auto bg-gray-100 rounded-lg p-5 relative">
        <h1 className="text-2xl font-bold">Add new facility expense</h1>
        <button
          className="absolute top-2 right-2 lg:hover:bg-red-500 lg:hover:text-white text-xl p-2"
          onClick={toggleShowAndHideExpenseForm}
        >
          <RxCross1 />
        </button>
        <div className="w-full p-2 lg:p-10">
          {/* description form field */}
          <div className="form-group w-full py-5">
            <label htmlFor="description" className="text-sm">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={2}
              placeholder="Add a description"
              className="w-full resize-none outline-none border-2 border-gray-300 rounded-lg p-3 text-sm focus:border-blue-200"
              onChange={(e) => {
                handleChangeFormField(e);
                markRequiredFormField(e.target);
              }}
            >
              {expenseData.description ? expenseData.description : ""}
            </textarea>
            <small className="text-red-600">Description is required!</small>
          </div>

          {/* amount form field */}
          <div className="form-group w-full pb-5">
            <label htmlFor="amount" className="text-sm ">
              Amount <span className="text-red-500">*</span>
              {}
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Add amount"
              value={expenseData.amount ? expenseData.amount : ""}
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              onChange={(e) => {
                handleChangeFormField(e);
                markRequiredFormField(e.target);
              }}
            />
            <small className="text-red-600">Amount is required!</small>
          </div>

          {/* currency form field */}
          <div className="form-group w-full pb-5">
            <label htmlFor="currency" className="text-sm ">
              Currency
              <span className="text-red-500">*</span>
            </label>
            <select
              name="currency"
              id="currency"
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              onChange={(e) => {
                handleChangeFormField(e);
                markRequiredFormField(e.target);
                setExpenseData((prev) => ({
                  ...prev,

                  dollarRate: currencyState["usd"],

                  desiredCurrencyRate:
                    currencyState[String(facility.preferedCurrency)],

                  transactionCurrencyRate:
                    currencyState[String(e.target.value)],
                }));
              }}
            >
              <option value={expenseData.currency ? expenseData.currency : ""}>
                {expenseData.currency
                  ? currencyArray.find(
                      (currency) => currency.code === expenseData.currency
                    )?.name
                  : "Select currency"}
              </option>
              {currencyArray.map((currency) => (
                <option value={currency.code} className="text-sm py-5">
                  <span className="text-3xl font-bold capitalize">
                    {currency.code}:
                  </span>{" "}
                  {currency.name}
                </option>
              ))}
            </select>
            <small className="text-red-600">Currency is required!</small>
          </div>

          {/* receipt number form field */}
          <div className="form-group w-full pb-5">
            <label htmlFor="receiptNumber" className="text-sm ">
              Receipt/Cheque/Transaction number {expenseData.receiptNumber}{" "}
              <span className="text-red-500"></span>
            </label>
            <input
              type="text"
              id="receiptNumber"
              placeholder="Add receipt number"
              value={expenseData.receiptNumber ? expenseData.receiptNumber : ""}
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              onChange={(e) => {
                handleChangeFormField(e);
              }}
            />
            <small></small>
          </div>

          {/* transaction from field */}
          <div className="form-group w-full pb-5">
            <label htmlFor="transactionDate" className="text-sm ">
              Transaction date
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="transactionDate"
              placeholder="Add transaction date"
              value={
                expenseData.transactionDate ? expenseData.transactionDate : ""
              }
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              onChange={(e) => {
                handleChangeFormField(e);
                markRequiredFormField(e.target);
              }}
            />
            <small className="text-red-600">
              Transaction date is required!
            </small>
          </div>

          {/* action buttons  */}
          <div className="form-group w-full py-5 flex justify-around items-center">
            <button
              className="text-lg rounded-md py-2 px-5 bg-blue-500 lg:hover:bg-blue-300 text-white w-1/3"
              onClick={() => {
                dispatch(setUserAction({ userAction: handleSaveExpense }));
                dispatch(
                  setConfirm({
                    status: true,
                    message: `Are you sure you want to save this expense (${
                      expenseData.description
                    } ${FormatMoney(
                      Number(expenseData.amount),
                      2,
                      String(expenseData.currency)
                    )}) `,
                  })
                );
              }}
            >
              Save
            </button>
            <button
              className="text-lg rounded-md py-2 px-5 bg-gray-500 lg:hover:bg-gray-300 text-white w-1/3"
              onClick={toggleShowAndHideExpenseForm}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ExpenseForm = React.memo(ExpenseForm);

export default ExpenseForm;
