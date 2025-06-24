const convertCurrency = (
  currencyState: any,
  desiredCurrency: string,
  facilityCurrency: string,
  price: number
) => {
  const convertedAmount: number =
    (Number(currencyState[desiredCurrency]) /
      Number(currencyState[facilityCurrency])) *
    Number(price);

  return Number(convertedAmount);
};

export const convertCurrency2 = (
  desiredCurrency: string,
  facilityCurrency: string,
  price: number
) => {
  const convertedAmount: number =
    (Number(desiredCurrency) / Number(facilityCurrency)) * Number(price);

  return Number(convertedAmount);
};

export default convertCurrency;
