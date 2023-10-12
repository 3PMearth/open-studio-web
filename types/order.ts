import type { User } from './user';

export interface Order {
  id: number;
  currency: string;
  order_number: string;
  order_status: string;
  sum_price: string;
  sum_amount: number;
  order_tokens: OrderToken[];
  created_at: string;
  updated_at: string;
  country_code?: string;
  phone_number?: string;
  buyer?: Partial<User>;
}

export interface OrderToken {
  id: number;
  amount: number;
  currency: string;
  price: string;
  token: number;
}

export interface DetailedOrderToken extends OrderToken {
  order: Partial<Order>;
}
