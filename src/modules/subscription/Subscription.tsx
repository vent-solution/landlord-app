import React from "react";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { SubscriptionModel } from "./SubscriptionModel";
import { TransactionStatusEnum } from "../../global/enums/transactionStatusEnum";
import { FormatMoney } from "../../global/actions/formatMoney";

interface Props {
  subscription: SubscriptionModel;
  subscriptionIndex: number;
}

const Subscription: React.FC<Props> = ({ subscription, subscriptionIndex }) => {
  const createdDate = subscription.dateCreated
    ? parseISO(subscription.dateCreated)
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
      <td className={`flex justify-center items-center py-5`}>
        <span
          className={` px-2 py-1 text-white rounded-full text-xs flex items-center justify-center ${
            subscription.transactionStatus === TransactionStatusEnum.pending
              ? "bg-black"
              : subscription.transactionStatus === TransactionStatusEnum.aproved
              ? "bg-green-600"
              : subscription.transactionStatus ===
                TransactionStatusEnum.cancelled
              ? "bg-red-600"
              : ""
          } `}
        >
          {subscriptionIndex + 1}
        </span>
      </td>
      <td className="px-2">{"USR-" + subscription.user?.userId}</td>
      <td className="px-2">
        {subscription.user?.firstName + " " + subscription.user?.lastName}
      </td>

      <td className="px-2">{subscription.user?.userRole}</td>
      <td className="px-2">{subscription.transactionNumber}</td>
      <td className="px-2 font-bold font-mono">
        {FormatMoney(subscription.amount, 2, subscription.currency)}
      </td>
      <td className="px-2">{subscription.paymentType}</td>
      <td className="px-2">
        {new Date(subscription.transactionDate).toDateString()}
      </td>
      <td className="px-2">{created}</td>

      <div className="absolute top-1/2 flex bg-red-800 w-54"></div>
    </tr>
  );
};

export default Subscription;
