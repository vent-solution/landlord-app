import React, { useCallback, useEffect, useState } from "react";
import AnnualIncomeChart from "../../global/charts/AnnualIncomeChart";
import { SettingsModel } from "../settings/SettingsModel";
import axios from "axios";
import { fetchData } from "../../global/api";
import { useSelector } from "react-redux";
import { getFacilities } from "../facilities/FacilitiesSlice";

interface Props {
  settings: SettingsModel;
}

const currentYear = new Date().getFullYear();

let AnnualEarnings: React.FC<Props> = ({ settings }) => {
  const [annualData, setAnnualData] = useState<
    { year: number; rentAmount: number }[]
  >([]);

  const [allFacilityIds, setAllFacilityIds] = useState<number[]>([]);

  const facilitiesState = useSelector(getFacilities);
  const { facilities } = facilitiesState;

  // set facility IDs
  useEffect(() => {
    setAllFacilityIds(
      facilities.map((facility) => Number(facility.facilityId))
    );
  }, [facilities]);

  // update annual earnings
  const updateEarningsForYear = useCallback(
    ({ year, rentAmount }: { year: number; rentAmount: number }) => {
      setAnnualData((prevData) =>
        prevData.map((data) => {
          return data.year === year
            ? { ...data, rentAmount: rentAmount + data.rentAmount }
            : data;
        })
      );
    },
    []
  );

  // fetch annual bid amount
  const fetchAnnualRentAmount = useCallback(
    async (year: number) => {
      try {
        const result = await fetchData(
          `/fetch-annual-landlord-rent-amount/${year}/${allFacilityIds}`
        );

        if (!result) {
          return;
        }

        if (result.status !== 200) {
          return;
        }
        updateEarningsForYear({
          year: new Date(result.data[0].year).getFullYear(),
          rentAmount: result.data[0].rentAmount,
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("FETCH ANNUAL BID AMOUNT CANCELLED: ", error.message);
        }
      }
    },
    [updateEarningsForYear, allFacilityIds]
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
        <AnnualIncomeChart
          currency={settings.preferedCurrency}
          data={annualData}
        />
      </div>
    </div>
  );
};

AnnualEarnings = React.memo(AnnualEarnings);
export default AnnualEarnings;
