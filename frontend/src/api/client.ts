import { requestJson } from "../services/http";
import { ApiCategory, ApiHealthCheck, ApiProduct } from "./types";

export const api = {
  getHealthCheck: () => requestJson<ApiHealthCheck>("/health_check/"),
  getCategories: () => requestJson<ApiCategory[]>("/categories/"),
  getProducts: () => requestJson<ApiProduct[]>("/products/")
};
