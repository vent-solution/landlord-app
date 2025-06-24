import React, { useCallback, useEffect, useState } from "react";
import { fetchData } from "../../global/api";
import axios from "axios";
import { FormatMoney, FormatMoneyExt } from "../../global/actions/formatMoney";
import { monthFullNames } from "../../global/monthNames";
import { SettingsModel } from "../settings/SettingsModel";
import { useSelector } from "react-redux";
import { getFacilities } from "../facilities/FacilitiesSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { UserModel } from "../users/models/userModel";

interface Props {
  settings: SettingsModel;
}

let TotalEarnings: React.FC<Props> = ({ settings }) => {
  const [totalEarning, setTotalEarnings] = useState<number>(0);

  const [curentYearTotalEarning, setCurrentYearTotalEarning] =
    useState<number>(0);

  const [curentMonthTotalEarning, setCurrentMonthTotalEarning] =
    useState<number>(0);

  const [currentWeekTotalEarning, setCurrentWeekTotalEarning] =
    useState<number>(0);

  const [todayTotalEarning, setTodayTotalEarning] = useState<number>(0);

  const [totalExpense, setTotalExpense] = useState<number>(0);

  const [currentYearTotalExpense, setCurrentYearTotalExpense] =
    useState<number>(0);

  const [currentMonthTotalExpense, setCurrentMonthTotalExpense] =
    useState<number>(0);

  const [currentWeekTotalExpense, setCurrentWeekTotalExpense] =
    useState<number>(0);

  const [todayTotalExpense, setTodayTotalExpense] = useState<number>(0);

  const [allFacilityIds, setAllFacilityIds] = useState<number[]>([]);

  const facilities = useSelector(getFacilities);

  // set facility ids
  useEffect(() => {
    setAllFacilityIds(
      facilities.facilities.map((facility) => Number(facility.facilityId))
    );
  }, [facilities.facilities]);

  // fetch total earnings
  const fetchTotalEarningsAmount = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-overall-landlord-rent-amount/${allFacilityIds}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setTotalEarnings(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TOTAL EARNINGS AMOUNT CANCELLED: ", error.message);
      }
    }
  }, [allFacilityIds]);

  // fetch current year's total earnings
  const fetchCurrentYearTotalAmount = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-current-year-landlord-rent/${allFacilityIds}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setCurrentYearTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT YEAR'S TOTAL EARNINGS CANCELLED: ",
          error.message
        );
      }
    }
  }, [allFacilityIds]);

  // fetch current month's total earnings
  const fetchCurrentMonthTotalEarning = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-landlord-current-month-total-rent/${allFacilityIds}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setCurrentMonthTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT MONTH'S TOTAL EARNINGS CANCELLED: ",
          error.message
        );
      }
    }
  }, [allFacilityIds]);

  // fetch current week's total earnings
  const fetchCurrentWeekTotalEarning = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-landlord-current-week-total-rent/${allFacilityIds}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setCurrentWeekTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT WEEK'S TOTAL EARNING CANCELLED: ",
          error.message
        );
      }
    }
  }, [allFacilityIds]);

  // fetch today's total earnings
  const fetchTodayTotalEarning = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-landlord-today-total-rent/${allFacilityIds}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }

      setTodayTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT WEEK'S TOTAL EARNING CANCELLED: ",
          error.message
        );
      }
    }
  }, [allFacilityIds]);

  // fetch total expense
  const fetchTotalExpenseAmount = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const result = await fetchData(
        `/fetch-overall-landlord-expense/${Number(currentUser.userId)}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TOTAL EARNINGS AMOUNT CANCELLED: ", error.message);
      }
    }
  }, []);

  // fetch total current year expense
  const fetchTotalCurrentYearExpenseAmount = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const result = await fetchData(
        `/fetch-current-year-landlord-expense/${Number(currentUser.userId)}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setCurrentYearTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TOTAL EARNINGS AMOUNT CANCELLED: ", error.message);
      }
    }
  }, []);

  // fetch total current Month expense
  const fetchTotalCurrentMonthExpenseAmount = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const result = await fetchData(
        `/fetch-current-month-landlord-expense/${Number(currentUser.userId)}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setCurrentMonthTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TOTAL EXPENSE AMOUNT CANCELLED: ", error.message);
      }
    }
  }, []);

  // fetch total current week expense
  const fetchTotalCurrentWeekExpenseAmount = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const result = await fetchData(
        `/fetch-current-week-landlord-expense/${Number(currentUser.userId)}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setCurrentWeekTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TOTAL EXPENSE AMOUNT CANCELLED: ", error.message);
      }
    }
  }, []);

  // fetch total current week expense
  const fetchTotalCurrentDayExpenseAmount = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const result = await fetchData(
        `/fetch-current-day-landlord-expense/${Number(currentUser.userId)}`
      );

      if (!result) {
        return;
      }

      if (result.status !== 200) {
        return;
      }
      setTodayTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TOTAL EXPENSE AMOUNT CANCELLED: ", error.message);
      }
    }
  }, []);

  // use effect for fetching total earnings
  useEffect(() => {
    fetchTotalEarningsAmount();
    fetchCurrentYearTotalAmount();
    fetchCurrentMonthTotalEarning();
    fetchCurrentWeekTotalEarning();
    fetchTodayTotalEarning();

    fetchTotalExpenseAmount();
    fetchTotalCurrentYearExpenseAmount();
    fetchTotalCurrentMonthExpenseAmount();
    fetchTotalCurrentWeekExpenseAmount();
    fetchTotalCurrentDayExpenseAmount();
  }, [
    fetchTotalEarningsAmount,
    fetchCurrentYearTotalAmount,
    fetchCurrentMonthTotalEarning,
    fetchCurrentWeekTotalEarning,
    fetchTodayTotalEarning,

    fetchTotalExpenseAmount,
    fetchTotalCurrentYearExpenseAmount,
    fetchTotalCurrentMonthExpenseAmount,
    fetchTotalCurrentWeekExpenseAmount,
    fetchTotalCurrentDayExpenseAmount,
  ]);

  return (
    <div className="w-full bg-gradient-to-t from-blue-800 via-blue-900 to-blue-950 text-white text-center">
      <div className="w-full flex flex-wrap justify-center items-center  ">
        {/* overall totals  */}
        <div className="w-full  lg:w-1/5 py-10 px-5">
          <h1 className="text-lg font-light font-mono text-green-300 flex items-center justify-center py-1">
            <FaArrowRight className="text-green-500 text-xs" />
            {totalEarning > 99999999
              ? FormatMoneyExt(totalEarning, 2, settings.preferedCurrency)
              : FormatMoney(totalEarning, 2, settings.preferedCurrency)}
          </h1>

          <h1 className="text-lg font-light font-mono text-red-300 flex items-center justify-center pb-1">
            <FaArrowLeft className="text-red-500 text-xs" />
            {totalEarning > 99999999
              ? FormatMoneyExt(totalEarning, 2, settings.preferedCurrency)
              : FormatMoney(totalExpense, 2, settings.preferedCurrency)}
          </h1>

          <h1 className="text-lg font-light font-mono flex items-center justify-center">
            {totalExpense - totalExpense > 99999999
              ? FormatMoneyExt(
                  totalExpense - totalExpense,
                  2,
                  settings.preferedCurrency
                )
              : FormatMoney(
                  totalEarning - totalExpense,
                  2,
                  settings.preferedCurrency
                )}
          </h1>
        </div>

        {/* current year's totals  */}
        <div className="w-1/2 lg:w-1/6 py-3 lg:py-10 text-xs">
          <h4 className=" text-gray-400 font-extrabold">
            {new Date().getFullYear()}
          </h4>
          <h1 className="font-light flex items-center justify-center text-green-300 py-2">
            <FaArrowRight className="text-green-500" />
            {FormatMoney(curentYearTotalEarning, 2, settings.preferedCurrency)}
          </h1>

          <h1 className="font-light flex items-center justify-center pb-2">
            <FaArrowLeft className="text-red-500 text-xs" />
            <span className="text-red-300">
              {FormatMoney(
                currentYearTotalExpense,
                2,
                settings.preferedCurrency
              )}
            </span>
          </h1>

          <h1 className="font-light flex items-center justify-center">
            {FormatMoney(
              curentYearTotalEarning - currentYearTotalExpense,
              2,
              settings.preferedCurrency
            )}
          </h1>
        </div>

        {/* current month's totals  */}
        <div className="w-1/2 lg:w-1/6 py-3 lg:py-10  text-xs">
          <h4 className=" text-gray-400 font-extrabold">
            {monthFullNames[new Date().getMonth()]}
          </h4>
          <h1 className="font-light flex items-center justify-center text-green-300 py-2">
            <FaArrowRight className="text-green-500" />
            {FormatMoney(curentMonthTotalEarning, 2, settings.preferedCurrency)}
          </h1>

          <h1 className="font-light flex items-center justify-center pb-2">
            <FaArrowLeft className="text-red-500" />
            <span className="text-red-300">
              {FormatMoney(
                currentMonthTotalExpense,
                2,
                settings.preferedCurrency
              )}
            </span>
          </h1>

          <h1 className="font-light flex items-center justify-center">
            {FormatMoney(
              curentMonthTotalEarning - currentMonthTotalExpense,
              2,
              settings.preferedCurrency
            )}
          </h1>
        </div>

        {/* current week's totals  */}
        <div className="w-1/2 lg:w-1/6 py-3 lg:py-10 text-xs">
          <h4 className=" text-gray-400 font-extrabold">this week</h4>
          <h1 className="font-light flex items-center justify-center text-green-300 py-2">
            <FaArrowRight className="text-green-500" />
            {FormatMoney(currentWeekTotalEarning, 2, settings.preferedCurrency)}
          </h1>

          <h1 className="font-light flex items-center justify-center text-red-300 pb-2">
            <FaArrowLeft className="text-red-500 text-xs" />
            {FormatMoney(currentWeekTotalExpense, 2, settings.preferedCurrency)}
          </h1>

          <h1 className="font-light flex items-center justify-center">
            {FormatMoney(
              currentWeekTotalEarning - currentWeekTotalExpense,
              2,
              settings.preferedCurrency
            )}
          </h1>
        </div>

        {/* today's totals  */}
        <div className="w-1/2 lg:w-1/6 py-3 lg:py-10  text-xs">
          <h4 className=" text-gray-400 font-extrabold">today</h4>
          <h1 className="font-light flex items-center justify-center text-green-300 py-2">
            <FaArrowRight className="text-green-500" />
            {FormatMoney(todayTotalEarning, 2, settings.preferedCurrency)}
          </h1>

          <h1 className="font-light flex items-center justify-center text-red-300 pb-2">
            <FaArrowLeft className="text-red-500" />
            {FormatMoney(todayTotalExpense, 2, settings.preferedCurrency)}
          </h1>

          <h1 className="font-light flex items-center justify-center">
            {FormatMoney(
              todayTotalEarning - todayTotalExpense,
              2,
              settings.preferedCurrency
            )}
          </h1>
        </div>
      </div>
      {/* <div className="w-full flex flex-wrap justify-center items-center  ">
        <div className="w-full text-orange-300 lg:w-1/5 py-3 lg:py-10">
          <h1 className="text-2xl font-light font-mono">
            {FormatMoney(totalEarning, 2, settings.preferedCurrency)}
          </h1>
        </div>
        <div className="w-1/2 lg:w-1/6 py-3 lg:py-10">
          <h4 className="text-xs text-gray-400 font-extrabold">
            {new Date().getFullYear()}
          </h4>
          <h1 className="font-light text-sm">
            {FormatMoney(curentYearTotalEarning, 2, settings.preferedCurrency)}
          </h1>
        </div>
        <div className="w-1/2 lg:w-1/6 py-3 lg:py-10">
          <h4 className="text-xs text-gray-400 font-extrabold">
            {monthFullNames[new Date().getMonth()]}
          </h4>
          <h1 className="font-light text-sm">
            {FormatMoney(curentMonthTotalEarning, 2, settings.preferedCurrency)}
          </h1>
        </div>
        <div className="w-1/2 lg:w-1/6 py-3 lg:py-10">
          <h4 className="text-xs text-gray-400 font-extrabold">this week</h4>
          <h1 className="font-light text-sm">
            {FormatMoney(currentWeekTotalEarning, 2, settings.preferedCurrency)}
          </h1>
        </div>
        <div className="w-1/2 lg:w-1/6 py-3 lg:py-10">
          <h4 className="text-xs text-gray-400 font-extrabold">today</h4>
          <h1 className="font-light text-sm">
            {FormatMoney(todayTotalEarning, 2, settings.preferedCurrency)}
          </h1>
        </div>
      </div> */}
    </div>
  );
};

TotalEarnings = React.memo(TotalEarnings);

export default TotalEarnings;
