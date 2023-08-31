"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";

import { getToken } from "api";
import Button from "components/button/Button";
import TokenThumbnail from "components/token-thumbnail/TokenThumbnail";
import { getPrice } from "lib/price";
import type { Currency } from "types/price";
import type { Token } from "types/token";

const MAX_CHECKOUT_AMOUNT = 4;

function TokenDetail() {
  const t = useTranslations("token-detail");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const tokenId = searchParams.get("id");
  const { slug } = useParams();

  const [token, setToken] = useState<Token>();
  const [currency, setCurrency] = useState<Currency>(
    locale === "ko" ? "krw" : "usd"
  );
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    const fetchToken = async () => {
      const _token = await getToken(tokenId as string);
      if (_token?.id) {
        setToken(_token);
      } else {
        // todo handle error
      }
    };
    if (tokenId) {
      fetchToken();
    }
  }, [tokenId]);

  const isSoldOut = token?.status !== "MINTED" || token?.stock === 0;

  const orderHref = (currency: "krw" | "usd") => ({
    pathname: `/order`,
    query: { tokenId, currency, amount, from: slug }
  });

  const handleDecrease = () => setAmount(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () =>
    setAmount(prev =>
      prev < MAX_CHECKOUT_AMOUNT ? prev + 1 : MAX_CHECKOUT_AMOUNT
    );

  const handleCurrencyChange = (e: React.FormEvent<HTMLFieldSetElement>) =>
    setCurrency(e.target.value as Currency);

  return (
    <div className="lg:p-6">
      <header className="lg:gap-3">
        <div className="lg:flex-1">
          <TokenThumbnail
            alt={token?.name}
            imgUrl={token?.token_img}
            animationUrl={token?.animation}
            width={600}
            height={600}
          />
        </div>
        <div className="space-y-6 p-4 lg:mt-4 lg:flex-1 lg:space-y-8 lg:p-0">
          <h1 className="text-2xl font-semibold leading-8">{token?.name}</h1>
          <div className="space-y-2">
            <span>{t("paymentMethod")}</span>
            <fieldset
              className={`${
                isSoldOut ? "opacity-40" : ""
              } flex flex-col divide-y divide-solid divide-gray-300 overflow-hidden rounded-lg border border-gray-300 lg:flex-row lg:divide-x`}
              disabled={isSoldOut}
              onChange={handleCurrencyChange}
            >
              <label
                className={`${
                  currency === "krw" ? "bg-primary-light" : ""
                } flex basis-1/2 cursor-pointer justify-between p-4`}
                htmlFor="krw"
              >
                <div className="flex flex-col gap-y-1">
                  <span>🇰🇷 국내 신용카드</span>
                  <span>{getPrice(token?.price_krw || "", "ko")}</span>
                </div>
                <input
                  className="appearance-none"
                  type="radio"
                  name="paymentType"
                  id="krw"
                  value="krw"
                  defaultChecked={currency === "krw"}
                />
                {currency === "krw" && (
                  <AiFillCheckCircle color="#30007E" size={24} />
                )}
              </label>
              <label
                className={`${
                  currency === "usd" ? "bg-primary-light" : ""
                } flex basis-1/2 cursor-pointer justify-between p-4`}
                htmlFor="usd"
              >
                <div className="flex flex-col gap-y-1">
                  <span>🌎 International Credit Card</span>
                  <span>{getPrice(token?.price_usd || "", "en")}</span>
                </div>
                <input
                  className="appearance-none"
                  type="radio"
                  name="paymentType"
                  id="usd"
                  value="usd"
                  defaultChecked={currency === "usd"}
                />
                {currency === "usd" && (
                  <AiFillCheckCircle color="#30007E" size={24} />
                )}
              </label>
            </fieldset>
          </div>
          <div className="flex flex-col items-baseline gap-4 lg:flex-row lg:justify-end lg:gap-16">
            <div className="flex w-full items-baseline justify-between lg:w-auto lg:gap-8">
              <span>{t("quantity")}</span>
              <div className="flex items-center gap-4">
                <button
                  className={`h-5 w-5 rounded-full bg-primary text-sm leading-3 text-white ${
                    amount === 1 && "opacity-40"
                  }`}
                  disabled={amount === 1}
                  onClick={handleDecrease}
                >
                  -
                </button>
                <p className="w-12 text-center">{amount}</p>
                <button
                  className={`h-5 w-5 rounded-full bg-primary text-sm leading-3 text-white ${
                    amount === 4 || token?.stock === amount ? "opacity-40" : ""
                  }`}
                  disabled={amount === 4 || token?.stock === amount}
                  onClick={handleIncrease}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex w-full items-baseline justify-between lg:w-auto lg:gap-8">
              <p>{isSoldOut ? t("price") : t("subtotal")}</p>
              <p className="text-lg">
                {getPrice(
                  !token
                    ? ""
                    : currency === "krw"
                    ? token.price_krw
                    : token.price_usd,
                  currency === "krw" ? "ko" : "en",
                  amount
                )}
              </p>
            </div>
          </div>
          <Link href={orderHref(currency)} className="block">
            <Button size="large" className="w-full" disabled={isSoldOut}>
              {t("checkout")}
            </Button>
          </Link>
        </div>
      </header>
      <div className="mt-4 border-t border-gray-light p-4 pt-8 lg:mt-8 lg:px-0 lg:pb-0">
        {locale === "ko" ? token?.description_ko : token?.description_en}
      </div>
    </div>
  );
}

export default TokenDetail;
