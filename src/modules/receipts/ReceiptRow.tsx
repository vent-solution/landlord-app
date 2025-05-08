import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { PAYMENT_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";
import { ReceiptModel } from "./ReceiptModel";
import { FormatMoney } from "../../global/actions/formatMoney";

interface Props {
  receipt: ReceiptModel;
  onClick: () => void;
}
let ReceiptRow: React.FC<Props> = ({ receipt, onClick }) => {
  const createdDate = receipt.dateCreated
    ? parseISO(receipt.dateCreated)
    : null;

  // formatting the checkIn  date and time
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
    <tr
      className="cursor-pointer text-sm text-center border-y-2 hover:bg-gray-100"
      onClick={() => onClick()}
    >
      {/* <td className="px-2 py-5">{"RCT-" + receipt.receiptId}</td> */}
      <td className="px-2 py-5">{receipt.receiptNumber}</td>
      <td className="px-2">{receipt.transaction}</td>
      <td className="px-2 font-mono font-bold">
        {FormatMoney(Number(receipt.amount), 2, receipt.currency)}
      </td>
      <td className="px-2">
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === receipt.paymentMethod)
            ?.label
        }
      </td>
      <td className="px-2">{new Date(receipt.paymentDate).toDateString()}</td>
      <td className="px-2 w-72 py-5">{receipt.description}</td>
      <td className="px-2">{created}</td>
    </tr>
  );
};

ReceiptRow = React.memo(ReceiptRow);

export default ReceiptRow;
