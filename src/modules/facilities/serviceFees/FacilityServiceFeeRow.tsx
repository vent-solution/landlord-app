import React from "react";
import { ServiceFeeModel } from "../../serviceFees/ServiceFeeModel";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { PAYMENT_TYPE_DATA } from "../../../global/PreDefinedData/PreDefinedData";

interface Props {
  serviceFee: ServiceFeeModel;
  serviceFeeIndex: number;
}

let FacilityServiceFeeRow: React.FC<Props> = ({
  serviceFee,
  serviceFeeIndex,
}) => {
  const createdDate = serviceFee.dateCreated
    ? parseISO(serviceFee.dateCreated)
    : null;

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
      <td className="px-2 py-5">{serviceFeeIndex + 1}</td>
      <td className="font-bold font-mono px-2">
        {FormatMoney(serviceFee.amount, 2, serviceFee.currency)}
      </td>
      <td className="px-2">
        {
          PAYMENT_TYPE_DATA.find(
            (type) => type.value === serviceFee.paymentType
          )?.label
        }
      </td>
      <td className="px-2">{created}</td>
      <td className="px-2">{"USR-" + serviceFee.paidBy.userId}</td>
      <td className="px-2">
        {serviceFee.paidBy.firstName + " " + serviceFee.paidBy.lastName}
      </td>
      <td className="px-2">{serviceFee.paidBy.userTelephone}</td>
      <td className="px-2">{serviceFee.paidBy.userEmail}</td>
    </tr>
  );
};

FacilityServiceFeeRow = React.memo(FacilityServiceFeeRow);

export default FacilityServiceFeeRow;
