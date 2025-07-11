import React from "react";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { ExpenseModel } from "./expenseModel";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { convertCurrency2 } from "../../../global/actions/currencyConverter";
import { useSelector } from "react-redux";
import { getCurrencyExchange } from "../../../other/apis/CurrencyExchangeSlice";

interface Props {
  expense: ExpenseModel;
  expenseIndex: number;
}

let Expense: React.FC<Props> = ({ expense }) => {
  const dateAdded = expense.dateCreated
    ? parseISO(String(expense.dateCreated))
    : null;

  const added = dateAdded
    ? Date.now() - dateAdded.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(dateAdded, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(dateAdded, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : // Use relative time
      "";

  return (
    <tr className="cursor-pointer text-sm text-start border-y-2 hover:bg-gray-100 bg-white">
      {/* <td className="py-5">{expenseIndex}</td> */}
      <td className="pt-5">{"USR-" + expense.addedBy.userId}</td>
      <td>{expense.addedBy.firstName + " " + expense.addedBy.lastName}</td>
      <td>{new Date(expense.transactionDate).toDateString()}</td>
      <td className="pt-5">{expense.description}</td>
      <td className="font-bold font-mono">
        {FormatMoney(
          convertCurrency2(
            expense.transactionCurrencyRate,
            expense.dollarRate,
            expense.amount
          ),
          2,
          expense.currency
        )}
      </td>

      <td>{added}</td>
    </tr>
  );
};

Expense = React.memo(Expense);

export default Expense;
