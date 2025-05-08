import { PaymentPartern } from "../../global/enums/paymentParternEnum";

export const calculateFutureDate = (
  balance: number,
  initialDate: Date,
  paymentPattern: String,
  period: number
) => {
  if (String(paymentPattern) === String(PaymentPartern.annually)) {
    return new Date(
      Number(balance) === 0
        ? initialDate.setFullYear(initialDate.getFullYear() + period)
        : initialDate.setFullYear(initialDate.getFullYear() + period - 1)
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.perSemester)) {
    return new Date(
      Number(balance) === 0
        ? initialDate.setMonth(initialDate.getMonth() + period * 4)
        : initialDate.setMonth(initialDate.getMonth() + (period - 1) * 4)
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.quaterly)) {
    return new Date(
      Number(balance) === 0
        ? initialDate.setMonth(initialDate.getMonth() + period * 3)
        : initialDate.setMonth(initialDate.getMonth() + (period - 1) * 3)
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.monthly)) {
    return new Date(
      Number(balance) === 0
        ? initialDate.setMonth(initialDate.getMonth() + period)
        : initialDate.setMonth(initialDate.getMonth() + period - 1)
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.weekly)) {
    return new Date(
      Number(balance) === 0
        ? initialDate.setDate(initialDate.getDate() + period * 7)
        : initialDate.setDate(initialDate.getDate() + (period - 1) * 7)
    ).toDateString();
  }

  if (
    String(paymentPattern) ===
    String(
      PaymentPartern.daily ||
        String(paymentPattern) === String(PaymentPartern.perNight)
    )
  ) {
    return new Date(
      Number(balance) === 0
        ? initialDate.setDate(initialDate.getDate() + period)
        : initialDate.setDate(initialDate.getDate() + period - 1)
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.hourly)) {
    return new Date(
      Number(balance) === 0
        ? initialDate.setHours(initialDate.getHours() + period)
        : initialDate.setHours(initialDate.getHours() + (period - 1))
    ).toDateString();
  }
};
