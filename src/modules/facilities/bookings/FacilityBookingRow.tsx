import React from "react";
import { BookingModel } from "./BookingModel";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  ACCOMMODATION_CATEGORY,
  ACCOMMODATION_TYPE_DATA,
  PAYMENT_TYPE_DATA,
} from "../../../global/PreDefinedData/PreDefinedData";

interface Props {
  booking: BookingModel;
}

let FacilityBookingRow: React.FC<Props> = ({ booking }) => {
  const createdDate = booking.dateCreated
    ? parseISO(booking.dateCreated)
    : null;

  // formating the date and time office created
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
      <td className="px-2 py-5">{"BKG-" + booking.bookingId}</td>
      <td className="px-2">
        {
          ACCOMMODATION_TYPE_DATA.find(
            (type) => type.value === booking.accommodation.accommodationType
          )?.label
        }

        {booking.accommodation.accommodationCategory &&
          booking.accommodation.accommodationCategory !== null && (
            <span className="italic font-bold">
              {" "}
              (
              {
                ACCOMMODATION_CATEGORY.find(
                  (category) =>
                    category.value ===
                    booking.accommodation.accommodationCategory
                )?.label
              }
              ){" "}
            </span>
          )}
      </td>
      <td>{booking.accommodation.accommodationNumber}</td>
      <td className="px-2">{"TNT-" + booking.tenant.tenantId}</td>
      <td className="px-2">
        {booking.tenant.user.firstName + " " + booking.tenant.user.lastName}
      </td>
      <td className="px-2">{booking.tenant.user.userTelephone}</td>
      <td className="px-2">{booking.tenant.user.userEmail}</td>
      <td className="px-2 font-bold font-mono">
        {FormatMoney(booking.amount, 2, booking.currency)}
      </td>
      <td className="px-2">
        {
          PAYMENT_TYPE_DATA.find((type) => type.value === booking.paymentType)
            ?.label
        }
      </td>
      <td className="px-2">{booking.checkIn}</td>
      <td className="px-2">{created}</td>
    </tr>
  );
};

FacilityBookingRow = React.memo(FacilityBookingRow);

export default FacilityBookingRow;
