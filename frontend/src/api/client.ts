import { requestEmpty, requestJson } from "../services/http";
import {
  ApiAddress,
  ApiBill,
  ApiCategory,
  ApiClient,
  ApiHealthCheck,
  ApiOrder,
  ApiOrderDetail,
  ApiProduct,
  ApiReview
} from "./types";

export type CategoryPayload = {
  name: string;
};

export type ProductPayload = {
  name: string;
  price: number;
  stock: number;
  category_id: number;
};

export type ClientPayload = {
  name: string;
  lastname: string;
  email: string;
  telephone?: string | null;
};

export type OrderPayload = {
  date: string;
  total: number;
  delivery_method: number;
  status: number;
  client_id: number;
  bill_id: number;
};

export type OrderDetailPayload = {
  quantity: number;
  price?: number | null;
  order_id: number;
  product_id: number;
};

export type BillPayload = {
  bill_number: string;
  discount?: number | null;
  date: string;
  total: number;
  payment_type: number;
  client_id: number;
};

export type AddressPayload = {
  street?: string | null;
  number?: string | null;
  city?: string | null;
  client_id: number;
};

export type ReviewPayload = {
  rating: number;
  comment?: string | null;
  product_id: number;
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
    }),
  getClients: () => requestJson<ApiClient[]>("/clients/"),
  getClient: (idKey: number) => requestJson<ApiClient>(`/clients/${idKey}/`),
  createClient: (payload: ClientPayload) =>
    requestJson<ApiClient>("/clients/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  updateClient: (idKey: number, payload: ClientPayload) =>
    requestJson<ApiClient>(`/clients/${idKey}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  deleteClient: (idKey: number) =>
    requestEmpty(`/clients/${idKey}/`, {
      method: "DELETE"
    }),
  getOrders: () => requestJson<ApiOrder[]>("/orders/"),
  getOrder: (idKey: number) => requestJson<ApiOrder>(`/orders/${idKey}/`),
  createOrder: (payload: OrderPayload) =>
    requestJson<ApiOrder>("/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  updateOrder: (idKey: number, payload: OrderPayload) =>
    requestJson<ApiOrder>(`/orders/${idKey}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  deleteOrder: (idKey: number) =>
    requestEmpty(`/orders/${idKey}/`, {
      method: "DELETE"
    }),
  getOrderDetails: () => requestJson<ApiOrderDetail[]>("/order_details/"),
  getOrderDetail: (idKey: number) =>
    requestJson<ApiOrderDetail>(`/order_details/${idKey}/`),
  createOrderDetail: (payload: OrderDetailPayload) =>
    requestJson<ApiOrderDetail>("/order_details/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  updateOrderDetail: (idKey: number, payload: OrderDetailPayload) =>
    requestJson<ApiOrderDetail>(`/order_details/${idKey}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  deleteOrderDetail: (idKey: number) =>
    requestEmpty(`/order_details/${idKey}/`, {
      method: "DELETE"
    }),
  getBills: () => requestJson<ApiBill[]>("/bills/"),
  getBill: (idKey: number) => requestJson<ApiBill>(`/bills/${idKey}/`),
  createBill: (payload: BillPayload) =>
    requestJson<ApiBill>("/bills/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  updateBill: (idKey: number, payload: BillPayload) =>
    requestJson<ApiBill>(`/bills/${idKey}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  deleteBill: (idKey: number) =>
    requestEmpty(`/bills/${idKey}/`, {
      method: "DELETE"
    }),
  getAddresses: () => requestJson<ApiAddress[]>("/addresses/"),
  getAddress: (idKey: number) =>
    requestJson<ApiAddress>(`/addresses/${idKey}/`),
  createAddress: (payload: AddressPayload) =>
    requestJson<ApiAddress>("/addresses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  updateAddress: (idKey: number, payload: AddressPayload) =>
    requestJson<ApiAddress>(`/addresses/${idKey}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  deleteAddress: (idKey: number) =>
    requestEmpty(`/addresses/${idKey}/`, {
      method: "DELETE"
    }),
  getReviews: () => requestJson<ApiReview[]>("/reviews/"),
  getReview: (idKey: number) => requestJson<ApiReview>(`/reviews/${idKey}/`),
  createReview: (payload: ReviewPayload) =>
    requestJson<ApiReview>("/reviews/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  updateReview: (idKey: number, payload: ReviewPayload) =>
    requestJson<ApiReview>(`/reviews/${idKey}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }),
  deleteReview: (idKey: number) =>
    requestEmpty(`/reviews/${idKey}/`, {
      method: "DELETE"
    })
};
