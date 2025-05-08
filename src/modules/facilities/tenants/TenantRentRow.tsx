import React from "react";
import { RentModel } from "../rent/RentModel";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { PAYMENT_TYPE_DATA } from "../../../global/PreDefinedData/PreDefinedData";
import convertRent from "../rent/rentConverter";

interface Props {
  rent: RentModel;
}

const TenantRentRow: React.FC<Props> = ({ rent }) => {
  const registeredDate = rent.dateCreated ? parseISO(rent.dateCreated) : null;

  const registered = registeredDate
    ? Date.now() - registeredDate.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(registeredDate, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(registeredDate, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : // Use relative time
      "";

  return (
    <tr className="border-y-blue-500 border-2 hover:bg-blue-100">
      <td>{"TNT-" + rent.tenant.tenantId}</td>
      <td>{rent.accommodation.accommodationNumber}</td>
      <td className="font-bold font-mono">
        {FormatMoney(
          convertRent(
            Number(rent.facilityCurrencyRate),
            rent.dollarRate,
            rent.amount
          ),
          // rent.amount,
          2,
          String(rent.currency)
        )}
      </td>
      <td>
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === rent.paymentType)
            ?.label
        }
      </td>
      <td>{new Date(rent.transactionDate).toDateString()}</td>
      <td>{registered}</td>
    </tr>
  );
};

export default TenantRentRow;
