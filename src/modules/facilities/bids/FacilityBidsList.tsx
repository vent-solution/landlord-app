import React, { useCallback, useEffect, useState } from "react";
import { FacilitiesModel } from "../FacilityModel";
import { FaSearch } from "react-icons/fa";
import AlertMessage from "../../../other/alertMessage";
import { useDispatch, useSelector } from "react-redux";
import PaginationButtons from "../../../global/PaginationButtons";
import axios from "axios";
import { fetchData } from "../../../global/api";
import { AppDispatch } from "../../../app/store";
import { getFacilityBids, resetFacilityBids } from "./FacilityBidsSlice";
import { BidModel } from "../../bids/BidModel";
import Bid from "../../bids/Bid";
import { getSettings } from "../../settings/SettingsSlice";
import { FormatMoney } from "../../../global/actions/formatMoney";
import FacilityBidForm from "./FacilityBidForm";

interface Props {
  facility: FacilitiesModel;
}

const FacilityBidsList: React.FC<Props> = ({ facility }) => {
  // local state variabes
  const [searchString, setSearchString] = useState<string>("");
  const [filteredFacilityBids, setFilteredFacilityBids] = useState<BidModel[]>(
    []
  );

  const [isShowBidForm, setIsShowBidForm] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const bidsState = useSelector(getFacilityBids);
  const { facilityBids, totalElements, totalPages, page, size } = bidsState;

  const adminFinancialSettings = useSelector(getSettings);
  const { settings } = adminFinancialSettings;

  // filter facility bids
  useEffect(() => {
    const originalFacilityBids =
      facilityBids.length > 0
        ? [...facilityBids].sort((a, b) => {
            const aBidId = a.bidId ? parseInt(String(a.bidId), 10) : 0;
            const bBidId = b.bidId ? parseInt(String(b.bidId), 10) : 0;
            return bBidId - aBidId;
          })
        : [];
    if (searchString.trim().length === 0) {
      setFilteredFacilityBids(originalFacilityBids);
    } else {
      const searchTerm = searchString.toLowerCase();
      setFilteredFacilityBids(
        originalFacilityBids.filter((facilityBid) => {
          const {
            bidId,
            bidAmount,
            paidBy: { userId },
            paymentType,
            dateCreated,
          } = facilityBid;

          const bidNumber = "BID-" + bidId;
          const paidByUser = "USR-" + userId;
          const bidYear = new Date(`${dateCreated}`).getFullYear();
          const bidMonth = new Date(`${dateCreated}`).getMonth() + 1;
          const bidDay = new Date(`${dateCreated}`).getDate();
          const bidDate = bidDay + "/" + bidMonth + "/" + bidYear;
          return (
            (bidDate && bidDate.toLowerCase().includes(searchTerm)) ||
            (bidNumber && bidNumber.toLowerCase().includes(searchTerm)) ||
            (bidAmount && bidAmount === Number(searchTerm)) ||
            (paymentType && paymentType.toLowerCase().includes(searchTerm)) ||
            (paidByUser && paidByUser.toLowerCase().includes(searchTerm))
          );
        })
      );
    }
  }, [searchString, facility, facilityBids]);

  // handle search event
  const handleSearchBids = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  // handle fetch next page
  const handleFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-bids-by-facility/${Number(facility.facilityId)}/${
          page + 1
        }/${size}`
      );
      dispatch(resetFacilityBids(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  // handle fetch previous page
  const handleFetchPreviousPage = useCallback(async () => {
    try {
      const result = await fetchData(
        `/fetch-bids-by-facility/${Number(facility.facilityId)}/${
          page - 1
        }/${size}`
      );
      console.log(result);
      dispatch(resetFacilityBids(result.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("FETCH BIDS CANCELLED ", error.message);
      }
      console.error("Error fetching bids: ", error);
    }
  }, [dispatch, page, size, facility.facilityId]);

  if (isShowBidForm) {
    return (
      <FacilityBidForm
        facility={facility}
        setIsShowBidForm={setIsShowBidForm}
      />
    );
  }

  return (
    <div className="users-list flex w-full py-2 h-svh lg:h-dvh mt-0 lg:mt-0 z-0">
      <div className="w-full h-[calc(100vh-140px)] relative bg-gray-200">
        <div className="w-full mb-5">
          <div className="w-full h-1/3 flex flex-wrap justify-end items-center px-10 py-3">
            <div className="w-1/2 lg:w-1/4 flex justify-between lg:justify-around items-center">
              <h1
                className="text-sm py-1 px-5 bg-blue-700 text-white lg:hover:bg-blue-400 cursor-pointer"
                onClick={() => setIsShowBidForm(true)}
              >
                Pay bid
              </h1>
            </div>
            <div className="w-full lg:w-2/3 flex flex-wrap justify-between items-center">
              <div className="w-full lg:w-1/2 flex justify-between lg:justify-around items-center font-bold">
                <h1 className="text-xl text-blue-900 font-mono">
                  {FormatMoney(
                    Number(facility.bidAmount),
                    2,
                    settings[0].preferedCurrency
                  )}
                </h1>
                <h1 className="text-lg">
                  {filteredFacilityBids.length + "/" + totalElements}
                </h1>
              </div>
              <div
                className={` rounded-full  bg-white flex justify-between border-blue-900 border-2 w-full lg:w-2/4 h-3/4 mt-5 lg:mt-0`}
              >
                <input
                  type="text"
                  name=""
                  id="search-subscription"
                  placeholder="Search for bid..."
                  className={`rounded-full w-full p-2 py-0 outline-none transition-all ease-in-out delay-150`}
                  onChange={handleSearchBids}
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
          style={{ height: "calc(100vh - 310px)" }}
        >
          {filteredFacilityBids.length > 0 ? (
            <table className="border-2 w-full bg-white shadow-lg">
              <thead className="sticky top-0 bg-blue-900 text-base text-white">
                <tr>
                  <th className="px-2">#</th>
                  <th className="px-2">Bid number</th>
                  <th className="px-2">Facility number</th>
                  <th className="px-2">Facility name</th>
                  <th className="px-2">Country</th>
                  <th className="px-2">City</th>
                  <th className="px-2">Amount</th>
                  <th className="px-2">Payment type</th>
                  <th className="px-2">Payment date</th>
                </tr>
              </thead>
              <tbody className="text-black font-light">
                {filteredFacilityBids.map((bid: BidModel, index: number) => (
                  <Bid key={index} bid={bid} bidIndex={index} />
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
      <AlertMessage />
    </div>
  );
};

export default FacilityBidsList;
