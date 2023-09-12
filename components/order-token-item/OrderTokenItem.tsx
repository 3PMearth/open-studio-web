import Link from "next/link";
import { useEffect, useState } from "react";

import { getToken } from "api";
import TokenThumbnail from "components/token-thumbnail";
import { getPrice } from "lib/price";
import type { OrderToken } from "types/order";
import { Token } from "types/token";

interface OrderTokenItemProps {
  orderToken: OrderToken;
}

export default function OrderTokenItem({ orderToken }: OrderTokenItemProps) {
  const { amount, currency, price, token: tokenId } = orderToken;

  const [token, setToken] = useState<Partial<Token>>();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken(`${tokenId}`);
      if (token?.id) {
        setToken(token);
      }
    };

    if (tokenId != null) {
      fetchToken();
    }
  }, [tokenId]);

  return (
    <Link href={`todo-go-to-media-browser`}>
      <div className="ml-auto flex items-center py-4 hover:bg-primary-light md:max-w-xs md:p-4">
        <div className="aspect-square w-14 overflow-hidden rounded-sm">
          <TokenThumbnail
            imgUrl={token?.token_img}
            alt={token?.name}
            width={56}
            height={56}
          />
        </div>
        <div className="ml-2 flex h-14 flex-1 items-center justify-between">
          <p className="font-semibold leading-5">{token?.name}</p>
          <div className="text-right text-sm font-light leading-5 text-gray-semilight">
            <p>{`${getPrice(
              price,
              currency === "krw" ? "ko" : "en"
            )} x ${amount}`}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
