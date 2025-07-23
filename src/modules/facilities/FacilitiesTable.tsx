import React from "react";
import PaginationButtons from "../../global/PaginationButtons";
import FacilityRow from "./FacilityRow";
import { FacilitiesModel } from "./FacilityModel";
import EmptyList from "../../global/EmptyList";
import Preloader from "../../other/Preloader";

interface Props {
  filteredFacilities: FacilitiesModel[];
  page: number;
  totalPages: number;
  handleFetchNextPage: () => Promise<void>;
  handleFetchPreviousPage: () => Promise<void>;

  status: "loading" | "idle" | "failed" | "succeeded";
}

const FacilitiesTable: React.FC<Props> = ({
  filteredFacilities,
  page,
  totalPages,
  handleFetchNextPage,
  handleFetchPreviousPage,
  status,
}) => {
  if (status === "loading") return <Preloader />;

  return (
    <>
      <div className="lg:px-5 mb-12 overflow-auto pb-5 mt-2 h-[calc(100vh-150px)]">
        {filteredFacilities && filteredFacilities.length > 0 ? (
          <table className="border-2 w-full bg-white text-center shadow-lg">
            <thead className="bg-blue-900 text-white sticky top-0">
              <tr className="text-sm">
                <th className="text-start font-bold p-2">No.</th>
                <th className="text-start font-bold p-2">Business</th>
                <th className="text-start font-bold p-2">Category</th>
                <th className="text-start font-bold p-2">Name</th>
                <th className="text-start font-bold p-2">Location</th>
                <th className="text-start font-bold p-2">Status</th>
                <th className="text-start font-bold p-2">Monthly Bid</th>
                <th className="text-start font-bold p-2">Registered</th>
              </tr>
            </thead>
            <tbody className="font-light">
              {filteredFacilities.map((facility, index) => (
                <FacilityRow
                  key={index}
                  facilityIndex={index}
                  facility={facility}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyList itemName="facility" />
        )}
      </div>
      <PaginationButtons
        page={page}
        totalPages={totalPages}
        handleFetchNextPage={handleFetchNextPage}
        handleFetchPreviousPage={handleFetchPreviousPage}
      />
    </>
  );
};

export default FacilitiesTable;
