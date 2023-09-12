"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { getToken, postPayment } from "api";
import { withAuth } from "components/auth";
import Button from "components/button";
import PhoneInput from "components/phone-input";
import TokenThumbnail from "components/token-thumbnail";
import { SESSION_KEY_ORDER_QUERIES } from "lib/constants";
import { getPrice } from "lib/price";
import type { Token } from "types/token";

interface OrderProps {
  walletAddress: string;
  userId: string;
}

function Order({ walletAddress, userId }: OrderProps) {
  const t = useTranslations("order");

  const { replace, push } = useRouter();

  const [token, setToken] = useState<Token>();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locale = useLocale();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || 1;
  const tokenId = searchParams.get("tokenId");
  const currency = searchParams.has("currency")
    ? searchParams.get("currency")
    : locale === "ko"
    ? "krw"
    : "usd";
  const from = searchParams.get("from");

  const isSoldOut = token?.status !== "MINTED" || token?.stock === 0;
  const isQueriesInvalid = !tokenId;

  useEffect(() => {
    if (isQueriesInvalid) {
      const savedQueries = sessionStorage.getItem(SESSION_KEY_ORDER_QUERIES);
      if (savedQueries) {
        try {
          const parsed = JSON.parse(savedQueries);
          let queryString = "";
          for (const key in parsed) {
            queryString += `${key}=${parsed[key]}&`;
          }
          replace(`/order?${queryString}`);
        } catch (e) {
          replace(from ? `/s/${from}` : "/");
        }
      } else {
        replace(from ? `/s/${from}` : "/");
      }
    } else {
      sessionStorage.removeItem(SESSION_KEY_ORDER_QUERIES);
    }
  }, [isQueriesInvalid, from, replace]);

  useEffect(() => {
    const fetchToken = async () => {
      const _token = await getToken(tokenId as string);
      if (_token?.id) {
        setToken(_token);
      } else {
        // todo handle error
      }
    };

    if (tokenId != null) {
      fetchToken();
    }
  }, [tokenId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitting && isPhoneVerified && isTermsChecked) {
      setIsSubmitting(true);
      const form = e.currentTarget;
      const data = new FormData(form);
      const result = await postPayment(data);
      if (result.ok) {
        push(
          `/order/success?amount=${amount}&currency=${currency}&tokenId=${tokenId}&from=${from}`
        );
      } else {
        const { message = "" } = await result.json();
        push(
          `/order/error?message=${message}&amount=${amount}&currency=${currency}&tokenId=${tokenId}`
        );
      }
    }
  };

  const handlePhoneNumberChange = ({
    countryCode,
    phoneNumber
  }: {
    countryCode: string;
    phoneNumber: string;
  }) => {
    setCountryCode(countryCode);
    setPhoneNumber(() => {
      if (locale === "ko" && phoneNumber.charAt(0) === "0") {
        return phoneNumber.substring(1);
      }
      return phoneNumber;
    });
  };

  const handlePhoneVerify = () => {
    // todo verify phone number
    setIsPhoneVerified(true);
  };

  const handleTermsChange = () => setIsTermsChecked(!isTermsChecked);

  return (
    <div className="p-4 pb-20 lg:p-6">
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold leading-8">
          {t("orderConfirmation")}
        </h1>
        <section className="border-t border-gray-light pt-8">
          <p className="mb-2 text-lg font-semibold">{t("nftInfo")}</p>
          <div className="flex">
            <TokenThumbnail
              alt={token?.name}
              width={126}
              height={126}
              imgUrl={token?.token_img}
            />
            <div className="grow">
              <p className="text-gray p-6">
                {token?.name} x {amount}
              </p>
            </div>
          </div>
        </section>
        <section className="border-t border-gray-light pt-8">
          <p className="mb-2 text-lg font-semibold">{t("walletAddress")}</p>
          <p className="hidden sm:inline-block">{walletAddress}</p>
          <p className="sm:hidden">
            {walletAddress.substring(0, 10)}...
            {walletAddress.substring(walletAddress.length - 10)}
          </p>
        </section>
        <section>
          <p className="mb-2 text-lg font-semibold">{t("phoneNumber")}</p>
          <div className="flex items-center gap-2">
            <PhoneInput
              className="grow"
              disabled={isPhoneVerified}
              onValueChange={handlePhoneNumberChange}
              inputProps={{ required: true }}
              value={`${countryCode}${phoneNumber}`}
            />
            {isPhoneVerified ? (
              <Button onClick={() => setIsPhoneVerified(false)}>
                {t("update")}
              </Button>
            ) : (
              <Button
                disabled={phoneNumber.length < 10}
                onClick={handlePhoneVerify}
              >
                {t("verify")}
              </Button>
            )}
          </div>
        </section>
        <section className="border-t border-gray-light pt-8">
          <input
            className="mb-2 mr-2 cursor-pointer"
            id="termsAndPolicy"
            onChange={handleTermsChange}
            type="checkbox"
          />
          <label className="cursor-pointer" htmlFor="termsAndPolicy">
            {t("termsAndPolicyLabel")}
          </label>
          <p className="whitespace-pre-line text-sm">
            {t("termsAndPolicyDetail")}
          </p>
        </section>
        {token && currency && (
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="tokens[0].token_id" value={token.id} />
            <input type="hidden" name="currency" value={currency} />
            <input type="hidden" name="user_id" value={userId} />
            <input
              type="hidden"
              name="success_url"
              value={`${window.location.origin}/${locale}/order/success`}
            />
            <input type="hidden" name="tokens[0].amount" value={amount} />
            <input
              type="hidden"
              name="country_code"
              value={`+${countryCode}`}
            />
            <input type="hidden" name="phone_number" value={phoneNumber} />
            <input type="hidden" name="sum_amount" value={amount} />
            <input
              type="hidden"
              name="sum_price"
              value={
                Number(amount) *
                Number(currency === "krw" ? token.price_krw : token.price_usd)
              }
            />
            <input
              type="hidden"
              name="error_url"
              value={`${window.location.origin}/${locale}/order/error`}
            />
            <Button
              size="large"
              className="fixed inset-x-4 bottom-4 lg:static lg:w-full"
              disabled={
                isSubmitting || isSoldOut || !isPhoneVerified || !isTermsChecked
              }
              type="submit"
            >
              {isSoldOut
                ? "SOLD OUT"
                : `${t("placeOrder")} | ${getPrice(
                    !token
                      ? ""
                      : currency === "krw"
                      ? token.price_krw
                      : token.price_usd,
                    currency === "krw" ? "ko" : "en",
                    Number(amount)
                  )}`}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default withAuth(Order);
