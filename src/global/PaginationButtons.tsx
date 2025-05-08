import React from "react";
import { FaBackward, FaForward } from "react-icons/fa";

interface Props {
  page: number;
  totalPages: number;
  handleFetchNextPage: () => Promise<void>;
  handleFetchPreviousPage: () => Promise<void>;
}
const PaginationButtons: React.FC<Props> = ({
  page,
  totalPages,
  handleFetchNextPage,
  handleFetchPreviousPage,
}) => {
  return (
    <div className="py-8 w-full flex justify-center items-center lg:absolute lg:bottom-0 lg:left-0">
      <div className="w-full lg:w-fit px-10  flex justify-around items-center font-bold">
        <button
          disabled={page === 0}
          className={`p-2 ${
            page !== 0 ? "bg-blue-500" : "bg-blue-300"
          } text-center lg:hover:bg-blue-300 text-2xl text-white rounded-lg`}
          onClick={handleFetchPreviousPage}
        >
          <FaBackward />
        </button>

        <h1 className="text-lg font-bold px-3">
          {`PAGE ${totalPages === 0 ? 0 : page + 1} / ${totalPages}`}
        </h1>

        <button
          disabled={page === totalPages || page + 1 === totalPages}
          className={`p-2 ${
            page !== totalPages && page + 1 !== totalPages
              ? "bg-blue-500"
              : "bg-blue-300"
          } text-center lg:hover:bg-blue-300 text-2xl text-white rounded-lg`}
          onClick={handleFetchNextPage}
        >
          <FaForward />
        </button>
      </div>
    </div>
  );
};

export default PaginationButtons;
