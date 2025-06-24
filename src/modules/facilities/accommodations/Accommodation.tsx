import React from "react";
import { AccommodationModel } from "./AccommodationModel";
import { parseISO, formatDistanceToNow, format } from "date-fns";
import { FacilitiesModel } from "../FacilityModel";
import { FormatMoney } from "../../../global/actions/formatMoney";
import {
  ACCOMMODATION_TYPE_DATA,
  PAYMENT_PARTERN,
} from "../../../global/PreDefinedData/PreDefinedData";
import { useNavigate } from "react-router-dom";

interface Props {
  accommodation: AccommodationModel;
  accommodationIndex: number;
  facility: FacilitiesModel;
  onClick: () => void;
}

const Accommodation: React.FC<Props> = ({
  accommodation,
  accommodationIndex,
  facility,
  onClick,
}) => {
  const navigate = useNavigate();

  const registeredDate = accommodation.dateCreated
    ? parseISO(accommodation.dateCreated)
    : null;

  const lastUpdated = accommodation.lastUpdated
    ? parseISO(accommodation.lastUpdated)
    : null;

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

  const updated = lastUpdated
    ? Date.now() - lastUpdated.getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      ? format(lastUpdated, "MMM d, yyyy") // Format as "Jan 1, 2022"
      : formatDistanceToNow(lastUpdated, { addSuffix: true })
          .replace("about ", "")
          .replace(" minute", " Min")
          .replace(" hour", " Hr")
          .replace(" day", " Day")
          .replace(" ago", " Ago")
          .replace("less than a Min Ago", "Just now")
    : // Use relative time
      "";

  return (
    <tr
      className="cursor-pointer text-sm text-start border-y-2 hover:bg-gray-100"
      onClick={() => {
        onClick();
        navigate(`?unit_id=${accommodation.accommodationId}`);
      }}
    >
      {/* <td className="py-5">{accommodationIndex + 1}</td> */}
      {/* <td>{"ACC-" + accommodation.accommodationId}</td> */}
      <td>{accommodation.accommodationNumber}</td>
      <td>{accommodation.floor}</td>
      <td>
        {
          ACCOMMODATION_TYPE_DATA.find(
            (type) => type.value === accommodation.accommodationType
          )?.label
        }
      </td>
      <td>{accommodation.capacity}</td>
      <td className="font-mono font-bold">
        {FormatMoney(accommodation.price, 2, facility.preferedCurrency)}{" "}
        {
          PAYMENT_PARTERN.find(
            (partern) => partern.value === accommodation.paymentPartten
          )?.label
        }
      </td>
      <td>{accommodation.availability}</td>
      {/* <td>
        {accommodation.tenants &&
          accommodation.tenants.length > 0 &&
          accommodation.tenants?.length}
      </td> */}
      <td>{registered}</td>
      <td>{updated}</td>
    </tr>
  );
};

export default Accommodation;
