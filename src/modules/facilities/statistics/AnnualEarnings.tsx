import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { fetchData } from "../../../global/api";
import AnnualIncomeChart from "../../../global/charts/AnnualIncomeChart";
import { SettingsModel } from "../../settings/SettingsModel";

interface Props {
  settings: SettingsModel;
  currency: string | undefined;
  facilityId: number | undefined;
}

const currentYear = new Date().getFullYear();

let AnnualEarnings: React.FC<Props> = ({ currency, facilityId }) => {
  const [annualData, setAnnualData] = useState<
    { year: number; rentAmount: number }[]
  >([]);

  // update annual earnings
  const updateEarningsForYear = useCallback(
    (yearlyUpdates: { year: number; rentAmount: number }[]) => {
      setAnnualData((prevData) => {
        return prevData.map((entry) => {
          const match = yearlyUpdates.find((u) => u.year === entry.year);
          if (match) {
            return {
              ...entry,
              rentAmount: entry.rentAmount + match.rentAmount,
            };
          }
          return entry;
        });
      });
    },
    []
  );

  // fetch annual bid amount
  const fetchAnnualRentAmount = useCallback(
    async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-annual-facility-rent-amount/${year}/${Number(facilityId)}`
        );

        console.log("FACILITY ANNUAL RENT: ", result.data);

        if (result.status !== 200) {
          console.log("ANNUAL BID AMOUNT", result.data);
          return;
        }
        updateEarningsForYear(result.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH ANNUAL BID AMOUNT CANCELLED: ", error.message);
        }
      }
    },
    [updateEarningsForYear, facilityId]
  );

  // Initialize annual data for the past 10 years and invoke the data fetching
  useEffect(() => {
    const genData: { year: number; rentAmount: number }[] = [];

    for (let y = currentYear - 10; y <= currentYear; y++) {
      genData.push({ year: y, rentAmount: 0 });
    }

    setAnnualData(genData);

    genData.forEach((data) => {
      fetchAnnualRentAmount(data.year);
    });
  }, [fetchAnnualRentAmount]);

  return (
    <div className="w-full text-sm text-white px-3 lg:px-5 py-10 lg:w-1/2 bg-gradient-to-l from-blue-950 via-blue-900 to-blue-950">
      <div className="w-full">
        <div className="pb-8 w-full flex justify-center items-center">
          <h1 className="text-white">Annual Earnings</h1>
        </div>
        <AnnualIncomeChart currency={String(currency)} data={annualData} />
      </div>
    </div>
  );
};

AnnualEarnings = React.memo(AnnualEarnings);
export default AnnualEarnings;
