import { Outlet } from "react-router-dom";
import CartDrawer from "../components/store/CartDrawer";
import StoreHeader from "../components/store/StoreHeader";
import { CartProvider } from "../store/cartStore";

export default function StoreLayout() {
  return (
    <CartProvider>
      <div className="store-app">
        <StoreHeader />

        <main className="store-content">
          <Outlet />
        </main>
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
