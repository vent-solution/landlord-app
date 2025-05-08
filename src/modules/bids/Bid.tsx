import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { BidModel } from "./BidModel";
import { FormatMoneyExt } from "../../global/actions/formatMoney";
import { Link } from "react-router-dom";
import { PAYMENT_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";

interface Props {
  bid: BidModel;
  bidIndex: number;
}

let Bid: React.FC<Props> = ({ bid, bidIndex }) => {
  const createdDate = bid.dateCreated ? parseISO(bid.dateCreated) : null;

  // formating the date and time Subscription created
  const created = createdDate
    ? Date.now() - createdDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(createdDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(createdDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : "";

  return (
    <tr className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100">
      <td className="px-2 py-5">{bidIndex + 1}</td>
      <td className="px-2">{"BID-" + bid.bidId}</td>
      <td className="px-2 text-blue-700">
        <Link to={`/facilities/${bid.facility.facilityId}`}>
          {"FAC-" + bid.facility.facilityId}
        </Link>
      </td>
      <td className="px-2">{bid.facility.facilityName}</td>
      <td className="px-2">{bid.facility.facilityLocation.country}</td>
      <td className="px-2">{bid.facility.facilityLocation.city}</td>

      <td className="px-2 font-bold font-mono">
        {FormatMoneyExt(bid.bidAmount, 2, bid.currency)}
      </td>
      <td className="px-2font-mono">
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === bid.paymentType)
            ?.label
        }
      </td>
      <td className="px-2">{created}</td>
    </tr>
  );
};

Bid = React.memo(Bid);

export default Bid;
