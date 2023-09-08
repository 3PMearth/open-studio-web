export interface Order {
  id: number;
  currency: string;
  order_number: string;
  order_status: string;
  sum_price: string;
  order_tokens: OrderToken[];
  created_at: string;
}

export interface OrderToken {
  id: number;
  amount: number;
  currency: string;
  price: string;
  token: number;
}
