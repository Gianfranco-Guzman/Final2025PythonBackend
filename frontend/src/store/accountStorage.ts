export type DemoUser = {
  email: string;
  name: string;
  role: "admin" | "customer";
  clientId?: number;
};

export type SavedCard = {
  holderName: string;
  cardNumber: string;
  expiry: string;
};

export const STORAGE_USER_KEY = "demoUser";
export const STORAGE_ADMIN_KEY = "isAdmin";
export const STORAGE_CARD_KEY = "demoCard";

const parseStorage = <T>(raw: string | null): T | null => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const getStoredUser = (): DemoUser | null =>
  parseStorage<DemoUser>(localStorage.getItem(STORAGE_USER_KEY));

export const persistUser = (user: DemoUser | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_ADMIN_KEY);
    return;
  }

  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(STORAGE_ADMIN_KEY, String(user.role === "admin"));
};

export const getStoredCard = (): SavedCard | null =>
  parseStorage<SavedCard>(localStorage.getItem(STORAGE_CARD_KEY));

export const persistCard = (card: SavedCard) => {
  localStorage.setItem(STORAGE_CARD_KEY, JSON.stringify(card));
};

export const clearStoredCard = () => {
  localStorage.removeItem(STORAGE_CARD_KEY);
};
