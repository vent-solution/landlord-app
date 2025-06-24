import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  FormatMoney,
  FormatMoneyExt,
} from "../../../global/actions/formatMoney";
import { monthFullNames } from "../../../global/monthNames";
import { fetchData } from "../../../global/api";
import { useParams } from "react-router-dom";
import { SettingsModel } from "../../settings/SettingsModel";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Props {
  settings: SettingsModel;
  currency: string | undefined;
}

let TotalEarnings: React.FC<Props> = ({ currency }) => {
  const [totalEarning, setTotalEarnings] = useState<number>(0);

  const [curentYearTotalEarning, setCurentYearTotalEarning] =
    useState<number>(0);

  const [curentMonthTotalEarning, setCurentMonthTotalEarning] =
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

  const { facilityId } = useParams();

  // fetch total earnings
  const fetchTotalEarningsAmount = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-overall-facility-rent-amount/${facilityId}`
      );

      if (!result || result.status !== 200) {
        return;
      }
      setTotalEarnings(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH TOTAL EARNINGS AMOUNT CANCELLED: ", error.message);
      }
    }
  }, [facilityId]);

  // fetch current year's total earnings
  const fetchCurentYearTotalAmount = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-current-year-facility-rent/${facilityId}`
      );
      if (!result || result.status !== 200) {
        return;
      }
      setCurentYearTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT YEAR'S TOTAL EARNINGS CANCELLED: ",
          error.message
        );
      }
    }
  }, [facilityId]);

  // fetch current month's total earnings
  const fetchCurentmonthTotalEarning = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-facility-current-month-total-rent/${facilityId}`
      );
      if (!result || result.status !== 200) {
        return;
      }
      setCurentMonthTotalEarning(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH CURRENT MONTH'S TOTAL EARNINGS CANCELLED: ",
          error.message
        );
      }
    }
  }, [facilityId]);

  // fetch current week's total earnings
  const fetchCurentWeekTotalEarning = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-facility-current-week-total-rent/${facilityId}`
      );
      if (!result || result.status !== 200) {
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
  }, [facilityId]);

  // fetch today's total earnings
  const fetchTodayTotalEarning = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-facility-today-total-rent/${facilityId}`
      );
      if (!result || result.status !== 200) {
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
  }, [facilityId]);

  // fetch total expense for the facility
  const fetchTotalExpense = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-total-expense-by-facility/${facilityId}`
      );
      if (!result || result.status !== 200) {
        return;
      }
      setTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH TOTAL EXPENSE FOR THE FACILITY CANCELLED: ",
          error.message
        );
      }
    }
  }, [facilityId]);

  // fetch current year total expense for the facility
  const fetchTotalCurrentYearExpense = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-total-current-year-expense-by-facility/${facilityId}`
      );
      if (!result || result.status !== 200) {
        return;
      }
      setCurrentYearTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH TOTAL EXPENSE FOR THE FACILITY CANCELLED: ",
          error.message
        );
      }
    }
  }, [facilityId]);

  // fetch  current month total expense for the facility
  const fetchTotalCurrentMonthExpense = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-total-current-month-expense-by-facility/${facilityId}`
      );
      if (!result || result.status !== 200) {
        return;
      }
      setCurrentMonthTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH TOTAL EXPENSE FOR THE FACILITY CANCELLED: ",
          error.message
        );
      }
    }
  }, [facilityId]);

  // fetch  current week total expense for the facility
  const fetchTotalCurrentWeekExpense = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-total-current-week-expense-by-facility/${facilityId}`
      );
      if (!result || result.status !== 200) {
        return;
      }
      setCurrentWeekTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH TOTAL EXPENSE FOR THE FACILITY CANCELLED: ",
          error.message
        );
      }
    }
  }, [facilityId]);

  // fetch  current day total expense for the facility
  const fetchTotalCurrentDayExpense = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-total-current-day-expense-by-facility/${facilityId}`
      );
      if (!result || result.status !== 200) {
        return;
      }
      setTodayTotalExpense(result.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(
          "FETCH TOTAL EXPENSE FOR THE FACILITY CANCELLED: ",
          error.message
        );
      }
    }
  }, [facilityId]);

  // use effect for fetching total earnings
  useEffect(() => {
    fetchTotalEarningsAmount();
    fetchCurentYearTotalAmount();
    fetchCurentmonthTotalEarning();
    fetchCurentWeekTotalEarning();
    fetchTodayTotalEarning();

    fetchTotalExpense();
    fetchTotalCurrentYearExpense();
    fetchTotalCurrentMonthExpense();
    fetchTotalCurrentWeekExpense();
    fetchTotalCurrentDayExpense();
  }, [
    fetchTotalEarningsAmount,
    fetchCurentYearTotalAmount,
    fetchCurentmonthTotalEarning,
    fetchCurentWeekTotalEarning,
    fetchTodayTotalEarning,

    fetchTotalExpense,
    fetchTotalCurrentYearExpense,
    fetchTotalCurrentMonthExpense,
    fetchTotalCurrentWeekExpense,
    fetchTotalCurrentDayExpense,
  ]);

  return (
    <div className="w-full bg-gradient-to-t from-blue-800 via-blue-900 to-blue-950 text-white text-center flex flex-wrap justify-center items-center lg:sticky lg:top-0 lg:z-20">
      <div className="w-full lg:w-1/5 py-10 px-5 lg:px-0 flex flex-wrap items-center justify-center">
        <h1 className="w-full text-lg font-light font-mono flex items-center justify-center text-green-300">
          <FaArrowRight className="text-green-500 text-xs" />
          {totalEarning > 9999999
            ? FormatMoneyExt(totalEarning, 2, String(currency))
            : FormatMoney(totalEarning, 2, String(currency))}
        </h1>

        <h1 className="w-full text-lg font-light font-mono flex items-center justify-center text-red-300">
          <FaArrowLeft className="text-red-500 text-xs" />
          {totalExpense > 9999999
            ? FormatMoneyExt(totalExpense, 2, String(currency))
            : FormatMoney(totalExpense, 2, String(currency))}
        </h1>

        <h1 className="w-full text-lg font-light font-mono flex items-center justify-center">
          {totalEarning - totalExpense > 9999999
            ? FormatMoneyExt(totalEarning - totalExpense, 2, String(currency))
            : FormatMoney(totalEarning - totalExpense, 2, String(currency))}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10 text-xs">
        <h4 className=" text-gray-400 font-extrabold">
          {new Date().getFullYear()}
        </h4>
        <h1 className="font-light flex items-center justify-center py-2 text-green-300">
          <FaArrowRight className="text-green-500 text-xs" />
          {curentYearTotalEarning > 9999999
            ? FormatMoneyExt(curentYearTotalEarning, 2, String(currency))
            : FormatMoney(curentYearTotalEarning, 2, String(currency))}
        </h1>

        <h1 className="font-light flex items-center justify-center text-red-300 pb-2">
          <FaArrowLeft className="text-red-500 text-xs" />
          {curentYearTotalEarning > 9999999
            ? FormatMoneyExt(currentYearTotalExpense, 2, String(currency))
            : FormatMoney(currentYearTotalExpense, 2, String(currency))}
        </h1>

        <h1 className="font-light flex items-center justify-center">
          {curentYearTotalEarning - currentYearTotalExpense > 9999999
            ? FormatMoneyExt(
                curentYearTotalEarning - currentYearTotalExpense,
                2,
                String(currency)
              )
            : FormatMoney(
                curentYearTotalEarning - currentYearTotalExpense,
                2,
                String(currency)
              )}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10 text-xs">
        <h4 className="text-xs text-gray-400 font-extrabold">
          {monthFullNames[new Date().getMonth()]}
        </h4>
        <h1 className="font-light text-green-300 flex items-center justify-center py-2">
          <FaArrowRight className="text-xs text-green-500" />
          {curentMonthTotalEarning > 9999999
            ? FormatMoneyExt(curentMonthTotalEarning, 2, String(currency))
            : FormatMoney(curentMonthTotalEarning, 2, String(currency))}
        </h1>

        <h1 className="font-light text-red-300 flex items-center justify-center pb-2">
          <FaArrowLeft className="text-xs text-red-500" />
          {currentMonthTotalExpense > 9999999
            ? FormatMoneyExt(currentMonthTotalExpense, 2, String(currency))
            : FormatMoney(currentMonthTotalExpense, 2, String(currency))}
        </h1>

        <h1 className="font-light flex items-center justify-center">
          {curentMonthTotalEarning - currentMonthTotalExpense > 9999999
            ? FormatMoneyExt(
                curentMonthTotalEarning - currentMonthTotalExpense,
                2,
                String(currency)
              )
            : FormatMoney(
                curentMonthTotalEarning - currentMonthTotalExpense,
                2,
                String(currency)
              )}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10 text-xs">
        <h4 className=" text-gray-400 font-extrabold">this week</h4>
        <h1 className="font-light flex items-center justify-center text-green-300 py-2">
          <FaArrowRight className="text-green-500 text-xs" />
          {currentWeekTotalEarning > 9999999
            ? FormatMoneyExt(currentWeekTotalEarning, 2, String(currency))
            : FormatMoney(currentWeekTotalEarning, 2, String(currency))}
        </h1>

        <h1 className="font-light flex items-center justify-center text-red-300 pb-2">
          <FaArrowLeft className="text-red-500 text-xs" />
          {currentWeekTotalEarning > 9999999
            ? FormatMoneyExt(currentWeekTotalExpense, 2, String(currency))
            : FormatMoney(currentWeekTotalExpense, 2, String(currency))}
        </h1>

        <h1 className="font-light flex items-center justify-center">
          {currentWeekTotalEarning - currentWeekTotalExpense > 9999999
            ? FormatMoneyExt(
                currentWeekTotalEarning - currentWeekTotalExpense,
                2,
                String(currency)
              )
            : FormatMoney(
                currentWeekTotalEarning - currentWeekTotalExpense,
                2,
                String(currency)
              )}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10 text-xs">
        <h4 className=" text-gray-400 font-extrabold">today</h4>
        <h1 className="font-light flex items-center justify-center text-green-300 py-2">
          <FaArrowRight className="text-green-500 text-xs" />
          {todayTotalEarning > 9999999
            ? FormatMoneyExt(todayTotalEarning, 2, String(currency))
            : FormatMoney(todayTotalEarning, 2, String(currency))}
        </h1>

        <h1 className="font-light flex items-center justify-center text-red-300 pb-2">
          <FaArrowLeft className="text-red-500 text-xs" />
          {todayTotalExpense > 9999999
            ? FormatMoneyExt(todayTotalExpense, 2, String(currency))
            : FormatMoney(todayTotalExpense, 2, String(currency))}
        </h1>

        <h1 className="font-light flex items-center justify-center">
          {todayTotalEarning - todayTotalExpense > 9999999
            ? FormatMoneyExt(
                todayTotalEarning - todayTotalExpense,
                2,
                String(currency)
              )
            : FormatMoney(
                todayTotalEarning - todayTotalExpense,
                2,
                String(currency)
              )}
        </h1>
      </div>
    </div>
  );
};

TotalEarnings = React.memo(TotalEarnings);

export default TotalEarnings;
