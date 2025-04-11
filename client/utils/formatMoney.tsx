import currency from "currency.js";

const formatMoney = (amount: number, currencyCode: string) => {
  const symbol = currencyCode === "USD" ? "$" : "£";

  return currency(amount, {
    symbol,
    precision: 0,
    separator: ",",
    decimal: ".",
  }).format();
};

export default formatMoney;
