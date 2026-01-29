import { ApiCategory } from "../api/types";
import { requestEmpty, requestJson } from "./http";

export type CategoryPayload = {
  name: string;
};

export const categoriesService = {
  getAll: () => requestJson<ApiCategory[]>("/categories/"),
  getOne: (idKey: number) =>
    requestJson<ApiCategory>(`/categories/${idKey}/`),
  create: (payload: CategoryPayload) =>
    requestJson<ApiCategory>("/categories/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  update: (idKey: number, payload: CategoryPayload) =>
    requestJson<ApiCategory>(`/categories/${idKey}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  remove: (idKey: number) =>
    requestEmpty(`/categories/${idKey}/`, {
      method: "DELETE"
    })
};
