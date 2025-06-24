import React, { useEffect, useState } from "react";
import { RentModel } from "./RentModel";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { PAYMENT_TYPE_DATA } from "../../../global/PreDefinedData/PreDefinedData";
import convertCurrency from "../../../global/actions/currencyConverter";
import { useSelector } from "react-redux";
import { getCurrencyExchange } from "../../../other/apis/CurrencyExchangeSlice";

interface Props {
  rent: RentModel;
  rentIndex: number;
}

const FacilityRentRow: React.FC<Props> = ({ rent, rentIndex }) => {
  const currencyState = useSelector(getCurrencyExchange);

  const actualAmount = convertCurrency(
    currencyState,
    String(rent.accommodation.facility.preferedCurrency),
    "usd",
    Number(rent.amount)
  );

  return (
    <tr className="cursor-pointer text-sm text-start border-y-2 hover:bg-gray-100 bg-white">
      {/* <td className="py-5">{rentIndex}</td> */}
      <td>{"TNT-" + rent.tenant.tenantId}</td>
      {!rent.tenant.companyName && (
        <td>{rent.tenant.user.firstName + " " + rent.tenant.user.lastName}</td>
      )}
      {rent.tenant.companyName && <td>{rent.tenant.companyName}</td>}

      <td>{rent.accommodation.accommodationNumber}</td>
      <td>{rent.accommodation.floor}</td>
      <td>
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === rent.paymentType)
            ?.label
        }
      </td>
      <td className="font-bold font-mono">
        {FormatMoney(actualAmount, 2, rent.currency)}
      </td>
      <td>{new Date(rent.transactionDate).toDateString()}</td>
    </tr>
  );
};

export default FacilityRentRow;
