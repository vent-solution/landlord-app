import { calculateFutureDate } from "../../modules/receipts/calculateFutureDate";

export const calculateRentExpiry = (
  balance: number,
  checkIn: Date,
  paymentPattern: string,
  period: number
) => {
  const currentDate = new Date();
  const currentDateTime = currentDate.getTime();

  const futureDate = new Date(
    String(calculateFutureDate(balance, checkIn, paymentPattern, period))
  );
  const futureDateTime = futureDate.getTime();

  return currentDateTime >= futureDateTime ? "red-500" : "green-600";
};
