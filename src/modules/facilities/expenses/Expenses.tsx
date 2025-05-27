import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "../../../app/store";
import Preloader from "../../../other/Preloader";
import { FaSearch } from "react-icons/fa";
import PaginationButtons from "../../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { FaDownload } from "react-icons/fa6";

import { getFacilityExpenses, resetFacilityExpenses } from "./expenseSlice";
import { ExpenseModel } from "./expenseModel";
import Expense from "./Expense";
import ExpensesFilterForm from "./ExpensesFilterForm";
import ExpenseForm from "./ExpenseForm";

interface Props {
  facilityId: number;
}
let Expenses: React.FC<Props> = ({ facilityId }) => {
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseModel[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const [isShowReportFilterForm, setIsShowReportFilterForm] = useState(false);

  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const rentState = useSelector(getFacilityExpenses);
  const {
    facilityExpenses,
    page,
    size,
    totalElements,
    totalPages,
    status,
    error,
  } = rentState;

  // toggle show and hid expense form
  const toggleShowAndHideExpenseForm = () => {
    setShowExpenseForm(!showExpenseForm);
  };

  // filter facility expenses basing on various parameters
  useEffect(() => {
    if (searchString.trim().length === 0) {
      setFilteredExpenses(facilityExpenses);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredExpenses(
        facilityExpenses.filter((expense) => {
          const { expenseId, addedBy, amount, dateCreated } = expense;

          const expenseNumber = "EXP-" + expenseId;
          const userNumber = "USR-" + addedBy.userId;

          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const expenseDateAdded = date + "/" + month + "/" + year;

          const userName = addedBy.firstName + " " + addedBy.lastName;

          return (
            expenseNumber.toLowerCase().includes(searchTerm) ||
            userNumber.toLowerCase().includes(searchTerm) ||
            userName.toLowerCase().includes(searchTerm) ||
            expenseDateAdded.toLowerCase().includes(searchTerm) ||
            (amount && Number(amount) === Number(searchTerm))
          );
        })
      );
    }
  }, [searchString, facilityExpenses]);

  // on change of the search field
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  }, []);

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-facility-expenses/${Number(facilityId)}/${
          Number(page) + 1
        }/${size}`
      );
      dispatch(resetFacilityExpenses(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH FACILITY EXPENSES CANCELLED ", error.message);
      }
      console.error("Error fetching facility expenses: ", error);
    }
  }, [dispatch, page, size, facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-facility-expenses/${Number(facilityId)}/${
          Number(page) - 1
        }/${size}`
      );
      dispatch(resetFacilityExpenses(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH EXPENSES CANCELLED ", error.message);
      }
      console.error("Error fetching expenses: ", error);
    }
  }, [dispatch, page, size, facilityId]);

  if (status === "loading") return <Preloader />;

  if (status === "failed") return <p>Error loading rent: {error}</p>;

  if (showExpenseForm)
    return (
      <ExpenseForm
        toggleShowAndHideExpenseForm={toggleShowAndHideExpenseForm}
        facilityId={facilityId}
      />
    );

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-2 lg:mt-0 z-0 bg-gray-200">
      <div className="list w-full h-[calc(100vh-130px)] relative">
        <div className="w-full mb-5">
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3">
            <div className="w-full lg:w-full flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex flex-wrap justify-between lg:justify-around items-center">
                <button
                  className="transition-all ease-in-out delay-100 text-lg py-1 p-5 border-2 border-green-600 text-green-600 lg:hover:text-white cursor-pointer lg:hover:bg-green-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => setIsShowReportFilterForm(true)}
                >
                  <span className="px-2">
                    <FaDownload />
                  </span>
                  <span>Expenses report</span>
                </button>
                <button
                  className="transition-all ease-in-out delay-100 text-lg py-1 p-5 bg-blue-500  text-white cursor-pointer lg:hover:bg-blue-400 rounded-lg active:scale-95 flex justify-around items-center  lg:m-0"
                  onClick={toggleShowAndHideExpenseForm}
                >
                  <span>Add expense</span>
                </button>
                <h1 className="text-lg">
                  {filteredExpenses.length + " / " + Number(totalElements)}
                </h1>
              </div>
              <div
                className={` rounded-full flex justify-between border-blue-900 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-users"
                  placeholder="Search for expense..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleChange}
                />
                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:px-5 mb-12 overflow-auto pb-5 mt-1"
          style={{ height: "calc(100vh - 290px)" }}
        >
          {filteredExpenses && filteredExpenses.length > 0 ? (
            <table className="border-2 w-full bg-white bordered text-center shadow-lg">
              <thead className="bg-blue-900 text-white sticky top-0">
                <tr className="text-sm">
                  <th className="px-2 font-bold py-1">#</th>
                  <th className="px-2 font-bold">Added by.</th>
                  <th className="px-2 font-bold">Name</th>
                  <th className="px-2 font-bold">Transaction date</th>
                  <th className="px-2 font-bold">Description</th>
                  <th className="px-2 font-bold">Amount</th>
                  <th className="px-2 font-bold">Added</th>
                </tr>
              </thead>
              <tbody className="font-light">
                {filteredExpenses.map((expense, index) => (
                  <Expense
                    key={index}
                    expenseIndex={index + 1}
                    expense={expense}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-5/6 flex justify-center items-center">
              <div
                className="w-14 lg:w-20 h-14 lg:h-20"
                style={{
                  background: "URL('/images/Ghost.gif')",
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          )}
        </div>
        <PaginationButtons
          page={Number(page)}
          totalPages={Number(totalPages)}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>
      <ExpensesFilterForm
        isShowReportFilterForm={isShowReportFilterForm}
        setIsShowReportFilterForm={setIsShowReportFilterForm}
        facilityId={facilityId}
      />
    </div>
  );
};

Expenses = React.memo(Expenses);

export default Expenses;
