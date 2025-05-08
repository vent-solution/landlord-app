export const FormatMoney = (
  value: number,
  decimals: number,
  currency: string
) => {
  let cc = currency;
  if (cc.length > 3) {
    cc = currency.slice(0, 3);
  } else if (cc.length < 3) {
    cc = currency + "u";
  }
  return new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: cc,
    minimumFractionDigits: decimals,
  }).format(value);
};

export const FormatMoneyExt = (
  value: number,
  decimals: number,
  currency: string
) => {
  let cc = currency;
  if (cc.length > 3) {
    cc = currency.slice(0, 3);
  } else if (cc.length < 3) {
    cc = currency + "u";
  }
  return new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: cc,
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: decimals,
  }).format(value);
};
