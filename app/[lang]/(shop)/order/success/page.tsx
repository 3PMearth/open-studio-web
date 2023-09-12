"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { getToken } from "api";
import Button from "components/button";
import TokenThumbnail from "components/token-thumbnail";
import type { Token } from "types/token";

function OrderSuccess() {
  const t = useTranslations("payment");

  const [token, setToken] = useState<Token>();

  const searchParams = useSearchParams();
  const tokenId = searchParams.get("tokenId");

  useEffect(() => {
    const fetchToken = async () => {
      const _token = await getToken(tokenId as string);
      if (_token?.id) {
        setToken(_token);
      }
    };

    if (tokenId != null) {
      fetchToken();
    }
  }, [tokenId]);

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-semibold leading-8">{t("thankYouTitle")}</h1>
      <div className="text-center">
        {token?.token_img && (
          <div className="mx-auto mt-8 h-60 w-60">
            <TokenThumbnail alt={token?.name} imgUrl={token?.token_img} />
          </div>
        )}
        <p className="mt-2 text-lg font-semibold">{token?.name}</p>
        <Link className="mt-8 inline-block" href={`/my`}>
          <Button size="large">{t("goToMyPage")}</Button>
        </Link>
      </div>
      <p className="mt-6 break-keep text-center text-sm">
        {t("willBeTransfered")}
        <br />
        {t("willBeRefunded")}
      </p>
    </div>
  );
}

export default OrderSuccess;
