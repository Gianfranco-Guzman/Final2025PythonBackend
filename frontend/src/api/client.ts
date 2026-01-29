import { ApiCategory, ApiHealthCheck, ApiProduct } from "./types";

const baseUrl = import.meta.env.VITE_API_URL;

if (!baseUrl) {
  throw new Error("Falta configurar VITE_API_URL en el archivo .env");
}

const toUrl = (path: string) => `${baseUrl.replace(/\/$/, "")}${path}`;

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(toUrl(path));
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Error HTTP ${response.status}`);
  }
  return (await response.json()) as T;
};

export const api = {
  getHealthCheck: () => request<ApiHealthCheck>("/health_check"),
  getCategories: () => request<ApiCategory[]>("/categories"),
  getProducts: () => request<ApiProduct[]>("/products")
};
