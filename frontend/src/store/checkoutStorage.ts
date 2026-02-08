import { CartItem } from "./cartStore";

export type CheckoutSummary = {
  customerName: string;
  customerEmail: string;
  address: string;
  total: number;
  purchasedAt: string;
  items: CartItem[];
};

const CHECKOUT_SUMMARY_KEY = "storeCheckoutSummary";

export const persistCheckoutSummary = (summary: CheckoutSummary) => {
  localStorage.setItem(CHECKOUT_SUMMARY_KEY, JSON.stringify(summary));
};

export const getStoredCheckoutSummary = (): CheckoutSummary | null => {
  const raw = localStorage.getItem(CHECKOUT_SUMMARY_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CheckoutSummary;
  } catch {
    return null;
  }
};

export const clearStoredCheckoutSummary = () => {
  localStorage.removeItem(CHECKOUT_SUMMARY_KEY);
};
