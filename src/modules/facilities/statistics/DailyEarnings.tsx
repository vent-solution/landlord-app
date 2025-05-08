import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { fetchData } from "../../../global/api";
import DailyEarningsChart from "../../../global/charts/DailyEarningsChart";
import { SettingsModel } from "../../settings/SettingsModel";

interface Props {
  settings: SettingsModel;
  currency: string | undefined;
  facilityId: number | undefined;
}

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

let DailyEarnings: React.FC<Props> = ({ currency, facilityId }) => {
  const [isMonthChanged, setIsMonthChanged] = useState<boolean>(false);
  const [totalDailyAmount, setTotalDailyAmount] = useState<number>(0);
  const [yearMonth, setYearMonth] = useState<string>(`${year}-${month}`);
  const [dailyData, setDailyData] = useState<
    { day: number; rentAmount: number }[]
  >([]);

  // compute the total of daily earnings for a given month
  useEffect(() => {
    setTotalDailyAmount(
      dailyData.length > 0
        ? dailyData
            .map((data) => data.rentAmount)
            .reduce((calc, add) => calc + add)
        : 0
    );
  }, [dailyData]);

  // update annual earnings
  const updateDailyEarnings = useCallback(
    ({ day, rentAmount }: { day: number; rentAmount: number }) => {
      setDailyData((prevData) =>
        prevData.map((data) => {
          return yearMonth && data.day === day
            ? { ...data, rentAmount: rentAmount + data.rentAmount }
            : data;
        })
      );
    },
    [yearMonth]
  );

  // fetch daily bid amount
  const fetchDailyRentAmount = useCallback(
    async (day: number) => {
      const date = new Date(yearMonth + "-" + day).toISOString().slice(0, 10);
      try {
        const result = await fetchData(
          `/fetch-daily-facility-rent-amount/${date}/${Number(facilityId)}`
        );

        if (result.status !== 200) {
          console.log("DAILY RENT AMOUNT", result.data);
          return;
        }
        console.log("RENT", result.data[0]);
        updateDailyEarnings(result.data[0]);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH DAILY RENT AMOUNT CANCELLED: ", error.message);
        }
      }
    },
    [updateDailyEarnings, yearMonth, facilityId]
  );

  // seting the selected year month
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    setYearMonth(`${year}-${month < 10 ? "0" + month : month}`);
  }, []);

  // Initialize annual data for the past 10 years and invoke the data fetching
  useEffect(() => {
    const today = new Date(yearMonth);
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const genData: { day: number; rentAmount: number }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      genData.push({ day: day, rentAmount: 0 });
    }

    setDailyData(genData);

    genData.forEach((data) => {
      fetchDailyRentAmount(data.day);
    });
  }, [yearMonth, fetchDailyRentAmount]);

  return (
    <div className="w-full text-sm text-gray-100 pb-11 px-3 lg:px-5 pt-5 shadow-lg font-extralight bg-gradient-to-t from-blue-950 via-blue-900 to-blue-800 uppercase">
      <div className="w-full py-5 px-10 flex justify-between items-center">
        <h1>
          daily earnings{" "}
          <span className="text-gray-300 text-xs">
            (
            {FormatMoney(
              isMonthChanged ? totalDailyAmount : totalDailyAmount,
              2,
              String(currency)
            )}
            )
          </span>
        </h1>
        <input
          type="month"
          name=""
          id="year-month"
          value={yearMonth}
          className="text-sm text-center py-2 px-3 w-fit outline-none border-none rounded-lg bg-blue-900 hover:bg-blue-950"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIsMonthChanged(true);
            setYearMonth(e.target.value);
          }}
        />
      </div>
      <DailyEarningsChart
        currency={String(currency)}
        data={dailyData}
        yearMonth={yearMonth}
        isMonthChanged={isMonthChanged}
      />
    </div>
  );
};

DailyEarnings = React.memo(DailyEarnings);

export default DailyEarnings;
