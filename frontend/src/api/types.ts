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
