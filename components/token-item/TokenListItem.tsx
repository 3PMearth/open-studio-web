import Image from "next/image";
import Link from "next/link";

import { getPrice } from "lib/price";
import { Token } from "types/token";

interface TokenItemProps {
  token: Token;
  href: string;
}

const formattedDate = (timestampString: string) => {
  const date = new Date(timestampString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${month}.${day}`;
};

// todo handle status
export default function TokenListItem({ token, href }: TokenItemProps) {
  const { token_img, name, price_krw, price_usd, status, created_at } = token;

  return (
    <Link href={href}>
      <div className="flex items-center px-6 py-2 hover:bg-primary-light">
        <div className="aspect-square w-14 overflow-hidden rounded-sm">
          {token_img && (
            <Image src={token_img} alt={name} width={56} height={56} />
          )}
        </div>
        <div className="flex h-14 flex-1 flex-col justify-between px-3">
          <p className="font-semibold leading-5">{name}</p>
          <p className="text-xs font-light leading-5 text-gray-semilight">
            {formattedDate(created_at)}
          </p>
        </div>
        <div className="text-right text-xs font-light leading-5">
          <p>{getPrice(price_krw, "ko")}</p>
          <p>{getPrice(price_usd, "en")}</p>
        </div>
      </div>
    </Link>
  );
}
