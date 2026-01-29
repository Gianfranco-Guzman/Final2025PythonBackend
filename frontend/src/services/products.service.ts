import { ApiProduct } from "../api/types";
import { requestJson } from "./http";

export const productsService = {
  getAll: () => requestJson<ApiProduct[]>("/products/")
};
