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

export default convertCurrency;
