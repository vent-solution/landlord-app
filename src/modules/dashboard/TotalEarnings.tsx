import React, { useCallback, useEffect, useState } from "react";
import { fetchData } from "../../global/api";
import axios from "axios";
import { FormatMoney } from "../../global/actions/formatMoney";
import { monthFullNames } from "../../global/monthNames";
import { SettingsModel } from "../settings/SettingsModel";
import { useSelector } from "react-redux";
import { getFacilities } from "../facilities/FacilitiesSlice";

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

  // use effect for fetching total earnings
  useEffect(() => {
    fetchTotalEarningsAmount();
    fetchCurrentYearTotalAmount();
    fetchCurrentMonthTotalEarning();
    fetchCurrentWeekTotalEarning();
    fetchTodayTotalEarning();
  }, [
    fetchTotalEarningsAmount,
    fetchCurrentYearTotalAmount,
    fetchCurrentMonthTotalEarning,
    fetchCurrentWeekTotalEarning,
    fetchTodayTotalEarning,
  ]);

  return (
    <div className="w-full bg-gradient-to-t from-blue-800 via-blue-900 to-blue-950 text-white text-center flex flex-wrap justify-center items-center lg:sticky lg:top-0 lg:z-20">
      <div className="w-full text-orange-300 lg:w-1/5 py-10">
        <h1 className="text-2xl font-light font-mono">
          {FormatMoney(totalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">
          {new Date().getFullYear()}
        </h4>
        <h1 className="font-light text-sm">
          {FormatMoney(curentYearTotalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">
          {monthFullNames[new Date().getMonth()]}
        </h4>
        <h1 className="font-light text-sm">
          {FormatMoney(curentMonthTotalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">this week</h4>
        <h1 className="font-light text-sm">
          {FormatMoney(currentWeekTotalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
      <div className="w-1/2 lg:w-1/6 py-10">
        <h4 className="text-xs text-gray-400 font-extrabold">today</h4>
        <h1 className="font-light text-sm">
          {FormatMoney(todayTotalEarning, 2, settings.preferedCurrency)}
        </h1>
      </div>
    </div>
  );
};

TotalEarnings = React.memo(TotalEarnings);

export default TotalEarnings;
