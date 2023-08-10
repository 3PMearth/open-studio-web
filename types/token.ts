import type { Asset } from "./asset";

export type Token = {
  id: string;
  name: string;
  token_img?: string;
  animation?: string;
  contract: number;
  user: number;
  stock: number;
  price_krw: string;
  price_usd: string;
  description_ko: string;
  description_en: string;
  status?: string;
  assets: Asset[];
  created_at: string;
};
