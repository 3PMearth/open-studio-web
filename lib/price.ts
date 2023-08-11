export const getPrice = (price: string, locale: string, amount: number = 1) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "ko" ? "KRW" : "USD",
    maximumFractionDigits: 0
  }).format(Number(price) * amount);
};
