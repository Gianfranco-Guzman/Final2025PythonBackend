import { Outlet } from "react-router-dom";
import CartDrawer from "../components/store/CartDrawer";
import ScrollToTopButton from "../components/store/ScrollToTopButton";
import StoreFooter from "../components/store/StoreFooter";
import StoreHeader from "../components/store/StoreHeader";
import StoreSubnav from "../components/store/StoreSubnav";
import { CartProvider } from "../store/cartStore";

export default function StoreLayout() {
  return (
    <CartProvider>
      <div className="store-app">
        <StoreHeader />
        <StoreSubnav />

        <main className="store-content">
          <div className="store-container">
            <Outlet />
          </div>
        </main>
        <ScrollToTopButton />
        <StoreFooter />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
