import { PaymentPartern } from "../../global/enums/paymentParternEnum";

export const calculateBalanceDate = (
  initialDate: Date,
  paymentPattern: String,
  period: number
) => {
  if (String(paymentPattern) === String(PaymentPartern.annually)) {
    return new Date(
      initialDate.setFullYear(initialDate.getFullYear() + period)
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.perSemester)) {
    return new Date(
      initialDate.setMonth(initialDate.getMonth() + period * 4)
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.quaterly)) {
    return new Date(
      initialDate.setMonth(initialDate.getMonth() + period * 3)
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.monthly)) {
    return new Date(
      initialDate.setMonth(initialDate.getMonth() + Number(period))
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.weekly)) {
    return new Date(
      initialDate.setDate(initialDate.getDate() + period * 7)
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
      initialDate.setDate(initialDate.getDate() + period)
    ).toDateString();
  }

  if (String(paymentPattern) === String(PaymentPartern.hourly)) {
    return new Date(
      initialDate.setHours(initialDate.getHours() + period)
    ).toDateString();
  }
};
