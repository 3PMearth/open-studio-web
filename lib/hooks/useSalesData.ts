import { useEffect, useMemo, useState } from 'react';

import { getUserSales } from 'api';
import type { DetailedOrderToken, Order } from 'types/order';

const useSalesData = (userId: string) => {
  const [sales, setSales] = useState<Order[]>();

  useEffect(() => {
    const fetchSales = async () => {
      let _sales = await getUserSales(userId);
      setSales(_sales.reverse());
    };

    setSales(undefined);
    if (userId) {
      fetchSales();
    }
  }, [userId]);

  const totalSales = useMemo(() => {
    if (!sales) return 0;
    return sales.reduce((acc, sale) => {
      return acc + sale.sum_amount;
    }, 0);
  }, [sales]);

  const salesPerToken = useMemo(() => {
    if (!sales) return undefined;
    return sales.reduce(
      (acc: { [tokenId: string]: { totalSales: number; orders: DetailedOrderToken[] } }, sale) => {
        sale.order_tokens.forEach((orderToken) => {
          if (!acc[orderToken.token]) {
            acc[orderToken.token] = {
              totalSales: 0,
              orders: [],
            };
          }
          acc[orderToken.token].totalSales += orderToken.amount;
          acc[orderToken.token].orders.push({
            ...orderToken,
            order: {
              id: sale.id,
              buyer: sale.buyer,
              order_number: sale.order_number,
              order_status: sale.order_status,
              country_code: sale.country_code,
              phone_number: sale.phone_number,
              created_at: sale.created_at,
              updated_at: sale.updated_at,
            },
          });
        });
        return acc;
      },
      {},
    );
  }, [sales]);

  return { totalSales, salesPerToken };
};

export default useSalesData;
