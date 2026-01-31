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

export type ApiClient = {
  id_key: number;
  name: string | null;
  lastname: string | null;
  email: string | null;
  telephone: string | null;
};

export type ApiOrder = {
  id_key: number;
  date: string;
  total: number;
  delivery_method: number;
  status: number;
  client_id: number;
  bill_id: number;
};

export type ApiOrderDetail = {
  id_key: number;
  quantity: number;
  price: number | null;
  order_id: number;
  product_id: number;
};
