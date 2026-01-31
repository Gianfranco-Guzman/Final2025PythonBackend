import { requestEmpty, requestJson } from "../services/http";
import { ApiCategory, ApiHealthCheck, ApiProduct } from "./types";

export type CategoryPayload = {
  name: string;
};

export type ProductPayload = {
  name: string;
  price: number;
  stock: number;
  category_id: number;
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
  getProducts: () => requestJson<ApiProduct[]>("/products/"),
  getProduct: (idKey: number) =>
    requestJson<ApiProduct>(`/products/${idKey}/`),
  createProduct: (payload: ProductPayload) =>
    requestJson<ApiProduct>("/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  updateProduct: (idKey: number, payload: ProductPayload) =>
    requestJson<ApiProduct>(`/products/${idKey}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  deleteProduct: (idKey: number) =>
    requestEmpty(`/products/${idKey}/`, {
      method: "DELETE"
    })
};
