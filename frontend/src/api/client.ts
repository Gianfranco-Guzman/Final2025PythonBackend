import { requestEmpty, requestJson } from "../services/http";
import { ApiCategory, ApiHealthCheck, ApiProduct } from "./types";

export type CategoryPayload = {
  name: string;
};

export const api = {
  getHealthCheck: () => requestJson<ApiHealthCheck>("/health_check/"),
  getCategories: () => requestJson<ApiCategory[]>("/categories/"),
  getCategory: (idKey: number) =>
    requestJson<ApiCategory>(`/categories/${idKey}/`),
  createCategory: (payload: CategoryPayload) =>
    requestJson<ApiCategory>("/categories/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  updateCategory: (idKey: number, payload: CategoryPayload) =>
    requestJson<ApiCategory>(`/categories/${idKey}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  deleteCategory: (idKey: number) =>
    requestEmpty(`/categories/${idKey}/`, {
      method: "DELETE"
    }),
  getProducts: () => requestJson<ApiProduct[]>("/products/")
};
