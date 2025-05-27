import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { FaDownload, FaPlus, FaSearch } from "react-icons/fa";
import Preloader from "../../other/Preloader";
import Subscription from "./Subscription";
import { SubscriptionModel } from "./SubscriptionModel";
import { getSubscription, resetSubscription } from "./SubscriptionSlice";
import axios from "axios";
import { fetchData } from "../../global/api";
import { AppDispatch } from "../../app/store";
import PaginationButtons from "../../global/PaginationButtons";
import SubscriptionForm from "./SubscriptionForm";
import SubscriptionFilterForm from "./SubscriptionFilterForm";

interface Props {}
const SubscriptionsList: React.FC<Props> = () => {
  // local state variabes
  const [searchString, setSearchString] = useState<string>("");
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    SubscriptionModel[]
  >([]);

  const [isShowSubscriptionForm, setIsShowSubscriptionForm] = useState(false);

  const [isShowReportFilterForm, setIsShowReportFilterForm] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const subscriptionState = useSelector(getSubscription);
  const {
    subscriptions,
    status,
    error,
    page,
    size,
    totalElements,
    totalPages,
  } = subscriptionState;

  // filter subscription based on different parameters
  useEffect(() => {
    const originalSubscriptions =
      subscriptions.length > 0
        ? [...subscriptions].sort((a, b) => {
            const aSubscriptionId = a.subscriptionId
              ? parseInt(a.subscriptionId, 10)
              : 0;
            const bSubscriptionId = b.subscriptionId
              ? parseInt(b.subscriptionId, 10)
              : 0;
            return bSubscriptionId - aSubscriptionId;
          })
        : [];

    if (searchString.trim().length === 0) {
      setFilteredSubscriptions(originalSubscriptions);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredSubscriptions(
        originalSubscriptions.filter((subscription) => {
          const {
            user,
            transactionStatus,
            transactionNumber,
            paymentType,
            dateCreated,
          } = subscription;

          const landlordNumber = "USR-" + user?.userId;

          const date = new Date(String(dateCreated)).getDate();
          const month = new Date(String(dateCreated)).getMonth() + 1;
          const year = new Date(String(dateCreated)).getFullYear();

          const subscriptionDate = date + "/" + month + "/" + year;

          return (
            (user?.firstName &&
              user?.firstName.toLowerCase().includes(searchTerm)) ||
            (transactionStatus &&
              transactionStatus.toLowerCase().includes(searchTerm)) ||
            (transactionNumber &&
              transactionNumber.toLowerCase().includes(searchTerm)) ||
            (paymentType && paymentType.toLowerCase().includes(searchTerm)) ||
            (landlordNumber &&
              landlordNumber.toLowerCase().includes(searchTerm)) ||
            (subscriptionDate &&
              subscriptionDate.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, subscriptions]);

  // handle search event
  const handleSerchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-subscription/${Number(page) + 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetSubscription(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  // handle fetch next page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-subscription/${Number(page) - 1}/${size}`
      );
      if (result.data.status && result.data.status !== "OK") {
      }
      dispatch(resetSubscription(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH ADMINS CANCELLED ", error.message);
      }
      console.error("Error fetching admins: ", error);
    }
  }, [dispatch, page, size]);

  if (status === "loading") return <Preloader />;
  if (error !== null) return <h1>{error}</h1>;

  if (isShowSubscriptionForm) {
    return (
      <SubscriptionForm setIsShowSubscriptionForm={setIsShowSubscriptionForm} />
    );
  }

  return (
    <div className="users-list flex w-full h-svh lg:h-dvh mt-20 lg:mt-0 z-0 relative">
      <div className="list w-full relative bg-gray-100">
        <div className="bg-white w-full">
          {/* <div className="upper bg-yellow-400 w-full h-2/3"></div> */}
          <div className="lower w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3 bg-white shadow-lg mb-5">
            <div className="w-full flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex flex-wrap justify-between lg:justify-around items-center">
                <h1
                  className="transition-all ease-in-out delay-100 text-lg py-1 p-5 border-2 border-green-600 text-green-600 lg:hover:text-white cursor-pointer lg:hover:bg-green-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => setIsShowReportFilterForm(true)}
                >
                  <span className="px-2">
                    <FaDownload />
                  </span>
                  <span>Subscriptions report</span>
                </h1>

                <button
                  className="transition-all ease-in-out delay-100 text-lg py-1 p-5 border-2 border-blue-600 text-blue-600 lg:hover:text-white cursor-pointer lg:hover:bg-blue-600 rounded-lg active:scale-95 flex justify-around items-center  m-2 lg:m-0"
                  onClick={() => setIsShowSubscriptionForm(true)}
                >
                  <span className="px-2">
                    <FaPlus />
                  </span>
                  <span>Pay subscription</span>
                </button>
                <h1 className="text-lg">
                  {filteredSubscriptions.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-1/3 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for subscription..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSerchUser}
                />

                <button className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-full text-xl text-center border ">
                  {<FaSearch />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:px-5 mb-12 overflow-auto pb-5 relative mt-2"
          style={{ height: "calc(100vh - 170px)" }}
        >
          {filteredSubscriptions.length > 0 ? (
            <table className="border-2 w-full bg-white">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr>
                  <th className="px-2">#</th>
                  <th className="px-2">User number</th>
                  <th className="px-2">User name</th>
                  <th className="px-2">Role</th>
                  <th className="px-2">Transaction number</th>
                  <th className="px-2">Amount</th>
                  <th className="px-2">Payment type</th>
                  <th className="px-2">Transaction date</th>
                  <th className="px-2">Date added</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredSubscriptions.map(
                  (subscription: SubscriptionModel, index: number) => (
                    <Subscription
                      key={index}
                      subscription={subscription}
                      subscriptionIndex={index}
                    />
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className="w-ull h-full flex justify-center items-center">
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
          page={page}
          totalPages={totalPages}
          handleFetchNextPage={handleFetchNextPage}
          handleFetchPreviousPage={handleFetchPreviousPage}
        />
      </div>
      <SubscriptionFilterForm
        isShowReportFilterForm={isShowReportFilterForm}
        setIsShowReportFilterForm={setIsShowReportFilterForm}
      />
    </div>
  );
};

export default SubscriptionsList;
