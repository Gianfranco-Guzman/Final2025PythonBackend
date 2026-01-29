export type ApiHealthCheck = {
  status: string;
  checks?: Record<string, unknown>;
};

export type ApiCategory = {
  id_key: number;
  name: string;
};

export type ApiProduct = {
  id_key: number;
  name: string;
  price: number;
  stock: number;
  category_id: number;
};
