const convertRent = (
  facilityCurrencyRate: number,
  dollarRate: number,
  amount: number
) => {
  const convertedAmount: number =
    (facilityCurrencyRate / dollarRate) * Number(amount);

  return Number(convertedAmount);
};

export default convertRent;
