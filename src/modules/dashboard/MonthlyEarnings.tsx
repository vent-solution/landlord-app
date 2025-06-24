import React, { useEffect, useState, useCallback } from "react";
import MonthlyIncomeChart from "../../global/charts/MonthlyEarningsChart";
import { SettingsModel } from "../settings/SettingsModel";
import axios from "axios";
import { fetchData } from "../../global/api";
import { FormatMoney } from "../../global/actions/formatMoney";
import { useSelector } from "react-redux";
import { getFacilities } from "../facilities/FacilitiesSlice";

interface Props {
  settings: SettingsModel;
}

const INITIAL_MONTHLY_RENT_DATA = [
  { monthNumber: 1, month: "Jan", rentAmount: 0 },
  { monthNumber: 2, month: "Feb", rentAmount: 0 },
  { monthNumber: 3, month: "Mar", rentAmount: 0 },
  { monthNumber: 4, month: "Apr", rentAmount: 0 },
  { monthNumber: 5, month: "May", rentAmount: 0 },
  { monthNumber: 6, month: "Jun", rentAmount: 0 },
  { monthNumber: 7, month: "Jul", rentAmount: 0 },
  { monthNumber: 8, month: "Aug", rentAmount: 0 },
  { monthNumber: 9, month: "Sep", rentAmount: 0 },
  { monthNumber: 10, month: "Oct", rentAmount: 0 },
  { monthNumber: 11, month: "Nov", rentAmount: 0 },
  { monthNumber: 12, month: "Dec", rentAmount: 0 },
];

const currentYear = new Date().getFullYear();

let MonthlyEarnings: React.FC<Props> = ({ settings }) => {
  const [monthlyData, setMonthlyData] = useState(INITIAL_MONTHLY_RENT_DATA);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [totalAnnualEarning, setTotalAnnualEarnings] = useState<number>(0);
  const [allFacilityIds, setAllFacilityIds] = useState<number[]>([]);

  const facilitiesState = useSelector(getFacilities);
  const { facilities } = facilitiesState;

  const availableYears = [];

  // set the array of available years starting from th current year up to the system initial year
  for (
    let y = currentYear;
    y >= new Date(String(settings.dateCreated)).getFullYear() - 1;
    y--
  ) {
    availableYears.push(y);
  }

  // Handle year selection change
  const handleChangeSelectYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  // set the facility IDs for all facilities that belong to the current landlord
  useEffect(() => {
    setAllFacilityIds(
      facilities.map((facility) => Number(facility.facilityId))
    );
  }, [facilities]);

  // compute the total monthly earnings for a given year
  useEffect(() => {
    setTotalAnnualEarnings(
      monthlyData
        .map((data) => data.rentAmount)
        .reduce((calc, add) => calc + add)
    );
  }, [monthlyData]);

  // Update earnings for months based on fetched data
  const updateEarningsForMonths = useCallback(
    (newData: { month: number; rentAmount: number }[]) => {
      if (selectedYear === 0) {
        setSelectedYear(currentYear);
      }
      if (newData.length === 0) {
        setMonthlyData(INITIAL_MONTHLY_RENT_DATA);
      } else {
        setMonthlyData((prevData) =>
          prevData.map((data) => {
            const matchingNewData = newData.find(
              (newItem) => newItem.month === data.monthNumber
            );

            return matchingNewData
              ? {
                  ...data,
                  rentAmount:
                    Number(matchingNewData.rentAmount) +
                    Number(data.rentAmount),
                }
              : { ...data, rentAmount: Number(data.rentAmount) };
          })
        );
      }
    },
    [selectedYear]
  );

  // Fetch total monthly rent amount when the selected year changes
  useEffect(() => {
    const fetchTotalMonthRent = async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-total-landlord-monthly-rent/${year}/${allFacilityIds}`
        );

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          return;
        }

        updateEarningsForMonths(result.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH CANCELLED: ", error.message);
        } else {
          console.error("Error fetching monthly rent:", error);
        }
      }
    };

    fetchTotalMonthRent(selectedYear);
  }, [selectedYear, updateEarningsForMonths, allFacilityIds]);

  return (
    <div className="w-full px-3 lg:px-5 py-10 lg:w-1/2 bg-gradient-to-l from-blue-950 via-blue-900 to-blue-950">
      <div className="w-full">
        <div className="pb-5 px-2 w-full flex justify-between items-center">
          <h1 className="text-white">
            Monthly earnings{" "}
            <span className="text-gray-300">
              ({FormatMoney(totalAnnualEarning, 2, settings.preferedCurrency)})
            </span>
          </h1>
          <select
            className="text-sm outline-none border-none bg-blue-900 hover:bg-blue-800 h-8 p-0 px-3 text-white rounded-lg cursor-pointer"
            onChange={handleChangeSelectYear}
            value={selectedYear}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <MonthlyIncomeChart
          currency={settings.preferedCurrency}
          data={monthlyData}
        />
      </div>
    </div>
  );
};

MonthlyEarnings = React.memo(MonthlyEarnings);

export default MonthlyEarnings;
