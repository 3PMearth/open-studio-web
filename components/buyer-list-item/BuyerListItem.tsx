import { formattedDate } from 'lib/date';
import type { DetailedOrderToken } from 'types/order';

interface BuyerItemProps {
  orderToken: DetailedOrderToken;
}

export default function BuyerListItem({ orderToken }: BuyerItemProps) {
  const { order, amount } = orderToken;
  return (
    <div>
      <div className="flex flex-col gap-4 px-6 py-6 hover:bg-primary-light sm:flex-row sm:items-center sm:gap-0">
        <span className="leading-5 sm:flex-[0.5]">
          {order.buyer?.first_name} {order.buyer?.last_name}
        </span>
        <div className="flex justify-between sm:flex-[0.5] sm:justify-evenly">
          <span>{order ? formattedDate(order.created_at!, true) : ''}</span>
          <span>{order.order_status}</span>
          <span>{amount}</span>
        </div>
      </div>
    </div>
  );
}
