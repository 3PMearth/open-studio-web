"use client";

import { useTranslations } from "next-intl";

import OrderTokenItem from "components/order-token-item/OrderTokenItem";
import { getPrice } from "lib/price";
import type { Order, OrderToken } from "types/order";

interface OrderItemProps {
  order: Order;
  href: string;
}

const formattedDate = (timestampString: string) => {
  const date = new Date(timestampString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${month}.${day}`;
};

export default function OrderListItem({ order }: OrderItemProps) {
  const t = useTranslations("my-page");

  const {
    currency,
    order_number,
    order_status,
    sum_price,
    order_tokens,
    created_at
  } = order;

  return (
    <div className="p-4 lg:px-6">
      <div className="flex flex-1 justify-between">
        <p className="text-sm font-semibold leading-5">
          {t("orderNumber")} {order_number}
        </p>
        <p className="text-sm uppercase text-primary">{order_status}</p>
      </div>
      <div className="my-4">
        {order_tokens?.map((token: OrderToken) => (
          <OrderTokenItem key={token.id} orderToken={token} />
        ))}
      </div>
      <div className="flex justify-between text-sm leading-5">
        <p className="font-light">{formattedDate(created_at)}</p>
        <p>{getPrice(sum_price, currency === "krw" ? "ko" : "en")}</p>
      </div>
    </div>
  );
}
