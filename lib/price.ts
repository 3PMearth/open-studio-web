export const getPrice = (price: string, locale: string, amount: number = 1) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale === 'ko' ? 'KRW' : 'USD',
    maximumFractionDigits: locale === 'ko' ? 0 : 2,
  }).format(Number(price) * amount);
};
