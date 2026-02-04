import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiProduct } from "../api/types";
import { resolveCategoryImage } from "../data/storeAssets";

const CART_STORAGE_KEY = "storeCart";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  categoryName: string;
  imageSrc: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (product: ApiProduct, categoryName: string, imageSrc?: string) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const readStoredItems = (): CartItem[] => {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => readStoredItems());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const addItem = (product: ApiProduct, categoryName: string, imageSrc?: string) => {
    if (product.stock <= 0) {
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id_key);
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + 1, product.stock);
        if (nextQuantity === existing.quantity) {
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id_key ? { ...item, quantity: nextQuantity } : item
        );
      }

      return [
        ...prev,
        {
          id: product.id_key,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
          categoryName,
          imageSrc: imageSrc ?? resolveCategoryImage(categoryName),
        },
      ];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id !== id) {
            return item;
          }
          const nextQuantity = Math.min(item.quantity + delta, item.stock);
          return { ...item, quantity: nextQuantity };
        })
        .filter((item) => item.quantity > 0);
      return updated;
    });
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      openCart,
      closeCart,
      toggleCart,
    }),
    [items, isOpen, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
