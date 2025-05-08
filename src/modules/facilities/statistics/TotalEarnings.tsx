import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { monthFullNames } from "../../../global/monthNames";
import { fetchData } from "../../../global/api";
import { useParams } from "react-router-dom";
import { SettingsModel } from "../../settings/SettingsModel";

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

  const { facilityId } = useParams();

  // const [facilityId, setfacilityId] = useState<number[]>([]);

  // const facilities = useSelector(getFacilities);

  // set facility ids
  // useEffect(() => {
  //   setfacilityId(
  //     facilities.facilities.map((facility) => Number(facility.facilityId))
  //   );
  // }, [facilities.facilities]);

  // fetch total earnings
  const fetchTotalEarningsAmount = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-overall-facility-rent-amount/${facilityId}`
      );

      if (result.status !== 200) {
        console.log(result.data);
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
      if (result.status !== 200) {
        console.log(result.data);
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
      if (result.status !== 200) {
        console.log(result.data);
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
      if (result.status !== 200) {
        console.log(result.data);
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
      if (result.status !== 200) {
        console.log(result.data);
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

  // use effect for fetching total earnings
  useEffect(() => {
    fetchTotalEarningsAmount();
    fetchCurentYearTotalAmount();
    fetchCurentmonthTotalEarning();
    fetchCurentWeekTotalEarning();
    fetchTodayTotalEarning();
  }, [
    fetchTotalEarningsAmount,
    fetchCurentYearTotalAmount,
    fetchCurentmonthTotalEarning,
    fetchCurentWeekTotalEarning,
    fetchTodayTotalEarning,
  ]);

  return (
    <div className="w-full bg-gradient-to-t from-blue-800 via-blue-900 to-blue-950 text-white text-center flex flex-wrap justify-center items-center lg:sticky lg:top-0 lg:z-20">
      <div className="w-full text-orange-300 lg:w-1/5 py-10">
        <h1 className="text-2xl font-light font-mono">
          {FormatMoney(totalEarning, 2, String(currency))}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">
          {new Date().getFullYear()}
        </h4>
        <h1 className="font-light text-sm">
          {FormatMoney(curentYearTotalEarning, 2, String(currency))}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">
          {monthFullNames[new Date().getMonth()]}
        </h4>
        <h1 className="font-light text-sm">
          {FormatMoney(curentMonthTotalEarning, 2, String(currency))}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">this week</h4>
        <h1 className="font-light text-sm">
          {FormatMoney(currentWeekTotalEarning, 2, String(currency))}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">today</h4>
        <h1 className="font-light text-sm">
          {FormatMoney(todayTotalEarning, 2, String(currency))}
        </h1>
      </div>
    </div>
  );
};

TotalEarnings = React.memo(TotalEarnings);

export default TotalEarnings;
