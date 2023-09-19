import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getToken } from 'api';
import { formattedDate } from 'lib/date';
import type { OrderToken } from 'types/order';
import type { Token } from 'types/token';

interface TokenSalesItemProps {
  tokenId: string;
  tokenSales: { totalSales: number; orders: OrderToken[] };
  href: string;
}

export default function TokenSalesListItem({ tokenId, tokenSales, href }: TokenSalesItemProps) {
  const [token, setToken] = useState<Token>();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken(tokenId);
      if (token?.id) {
        setToken(token);
      }
    };

    if (tokenId != null) {
      fetchToken();
    }
  }, [tokenId]);

  return (
    <Link href={href}>
      <div className="flex flex-col gap-4 px-6 py-6 hover:bg-primary-light sm:flex-row sm:items-center sm:gap-0">
        <span className="font-semibold leading-5 sm:flex-[0.5]">{token?.name}</span>
        <div className="flex justify-between sm:flex-[0.5] sm:justify-evenly">
          <span>{token ? formattedDate(token.created_at) : ''}</span>
          <span>{token?.status}</span>
          <span>{tokenSales.totalSales}</span>
        </div>
      </div>
    </Link>
  );
}
