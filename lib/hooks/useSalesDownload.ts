import { useCallback, useState } from 'react';
import { utils, writeFileXLSX } from 'xlsx';

import { formattedDate } from 'lib/date';
import { DetailedOrderToken } from 'types/order';

export default function useSalesDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback((orders: DetailedOrderToken[]) => {
    setIsDownloading(true);
    const data = orders
      .filter((order) => order.order.buyer)
      .map((order) => {
        const { buyer, country_code, phone_number, created_at, order_status } = order.order;
        return {
          Name: `${buyer!.first_name} ${buyer!.last_name}`,
          Email: buyer!.email,
          Phone: `${country_code}${phone_number}`,
          WalletAddress: buyer!.wallet_address,
          LoginType: buyer!.sso_type,
          Amount: order.amount,
          OrderTime: formattedDate(created_at!, true),
          OrderStatus: order_status,
        };
      });

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, '3PM_Sales');

    writeFileXLSX(workbook, `3PM_Sales_${formattedDate(new Date().toISOString())}.xlsx`);
    setIsDownloading(false);
  }, []);

  return { download, isDownloading };
}
