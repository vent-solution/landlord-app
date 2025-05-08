import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { AppDispatch } from "../../app/store";
import { fetchData } from "../../global/api";
import PaginationButtons from "../../global/PaginationButtons";
import Preloader from "../../other/Preloader";
import { UserModel } from "../users/models/userModel";

import ReceiptRow from "./ReceiptRow";
import { getReceipts, resetReceipts } from "./receiptsSlice";
import { ReceiptModel } from "./ReceiptModel";
import ReceiptDetails from "./ReceiptDetails";
import { FaDownload } from "react-icons/fa6";
import ReceiptsFilterForm from "./ReceiptsFilterForm";

interface Props {}
const ReceiptsList: React.FC<Props> = () => {
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptModel[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const [currentReceipt, setCurrentReceipt] = useState<ReceiptModel>();

  const [showReceiptDetails, setShowReceiptDetails] = useState<boolean>(false);

  const [isShowReportFilterForm, setIsShowReportFilterForm] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const receiptState = useSelector(getReceipts);
  const { receipts, page, size, totalElements, totalPages, status, error } =
    receiptState;

  // filter landlord receipts
  useEffect(() => {
    if (searchString.trim().length < 1) {
      setFilteredReceipts(receipts);

      return;
    }

    setFilteredReceipts(
      receipts.filter((receipt) => {
        const paymentDate = new Date(String(receipt.paymentDate)).getDate();
        const paymentMonth =
          new Date(String(receipt.paymentDate)).getMonth() + 1;
        const paymentYear = new Date(String(receipt.paymentDate)).getFullYear();

        const receiptPaymentDate =
          paymentDate + "/" + paymentMonth + "/" + paymentYear;

        const receiptId = "RCT-" + receipt.receiptId;

        return (
          receiptPaymentDate
            .toLocaleLowerCase()
            .trim()
            .includes(searchString) ||
          receiptId.toLocaleLowerCase().trim().includes(searchString) ||
          (receipt.receiptNumber &&
            receipt.receiptNumber
              .toLocaleLowerCase()
              .trim()
              .includes(searchString)) ||
          (receipt.transaction &&
            receipt.transaction
              ?.toLocaleLowerCase()
              .trim()
              .includes(searchString))
        );
      })
    );
  }, [receipts, searchString]);

  // handle search receipts
  const handleSearchFacilityHistory = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchString(e.target.value);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const result = await fetchData(
        `/fetch-receipts-by-landlord/${Number(currentUser.userId)}/${
          page + 1
        }/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetReceipts(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH HISTORY CANCELLED ", error.message);
      }
      console.error("Error fetching history: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    try {
      const result = await fetchData(
        `/fetch-receipts-by-landlord/${Number(currentUser.userId)}/${
          page - 1
        }/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetReceipts(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH HISTORY CANCELLED ", error.message);
      }
      console.error("Error fetching history: ", error);
    }
  }, [dispatch, page, size]);

  // show and hide receipt details
  const toggleShowReceiptDetails = () => {
    setShowReceiptDetails(!showReceiptDetails);
  };

  // conditional rendering depending on error or status
  if (status === "loading") return <Preloader />;
  if (error) return <h1>{error}</h1>;

  if (showReceiptDetails)
    return (
      <div className="h-[calc(100vh-0px)] lg:px-5 overflow-auto w-full">
        <ReceiptDetails
          receipt={currentReceipt}
          toggleShowReceiptDetails={toggleShowReceiptDetails}
        />
      </div>
    );

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-24 lg:mt-0 z-0 relative">
      <div className="h-[calc(100vh-0px)] w-full relative bg-gray-200">
        <div className="bg-white w-full mb-3 shadow-lg">
          <div className="w-full h-1/3 flex flex-wrap justify-between items-center px-10 py-3">
            <div className="w-full lg:w-1/4"></div>

            <div className="w-full flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex flex-wrap justify-between lg:justify-around items-center">
                <h1
                  className="transition-all ease-in-out delay-100 text-lg py-1 p-5 border-2 border-green-600 text-green-600 lg:hover:text-white cursor-pointer lg:hover:bg-green-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => setIsShowReportFilterForm(true)}
                >
                  <span className="px-2">
                    <FaDownload />
                  </span>
                  <span>Receipts report</span>
                </h1>
                <h1 className="text-lg font-bold">
                  {filteredReceipts.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-950 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for history..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchFacilityHistory}
                />

                <button className="bg-blue-950 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:px-5 mb-12 overflow-auto pb-5"
          style={{ height: "calc(100vh - 150px)" }}
        >
          {filteredReceipts.length > 0 ? (
            <table className="border-2 w-full bg-white mt-2 lg:mt-0 shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-white">
                <tr>
                  {/* <th>#ID</th> */}
                  <th>Receipt Number</th>
                  <th>Transaction</th>
                  <th>Amount</th>
                  <th>Payment method</th>
                  <th>Transaction date</th>
                  <th>Description</th>
                  <th>Date created</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((receipt, index) => (
                  <ReceiptRow
                    key={index}
                    receipt={receipt}
                    onClick={() => {
                      setCurrentReceipt(receipt);
                      toggleShowReceiptDetails();
                    }}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-full flex justify-center items-center">
              <div
                className="w-80 h-80"
                style={{
                  background: "URL('/images/Ghost.gif')",
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          )}
        </div>
        <PaginationButtons
          page={page}
          totalPages={totalPages}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>
      <ReceiptsFilterForm
        isShowReportFilterForm={isShowReportFilterForm}
        setIsShowReportFilterForm={setIsShowReportFilterForm}
      />
    </div>
  );
};

export default ReceiptsList;
