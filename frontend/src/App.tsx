import { Route, Routes } from "react-router-dom";
import StoreLayout from "./layouts/StoreLayout";
import AdminGate from "./components/store/AdminGate";
import AddressesPage from "./pages/AddressesPage";
import BillsPage from "./pages/BillsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ClientsPage from "./pages/ClientsPage";
import Dashboard from "./pages/Dashboard";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import ReviewsPage from "./pages/ReviewsPage";
import StoreHome from "./pages/store/StoreHome";
import StoreAccount from "./pages/store/StoreAccount";
import StoreProductDetail from "./pages/store/StoreProductDetail";
import StoreProducts from "./pages/store/StoreProducts";
import StoreCategories from "./pages/store/StoreCategories";
import StoreCheckoutSuccess from "./pages/store/StoreCheckoutSuccess";

export default function App() {
  return (
    <Routes>
      <Route path="/store" element={<StoreLayout />}>
        <Route index element={<StoreHome />} />
        <Route path="products" element={<StoreProducts />} />
        <Route path="categories" element={<StoreCategories />} />
        <Route path="products/:id" element={<StoreProductDetail />} />
        <Route path="account" element={<StoreAccount />} />
        <Route path="checkout-success" element={<StoreCheckoutSuccess />} />
      </Route>

      <Route path="/" element={<AdminGate />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="order-details" element={<OrderDetailsPage />} />
        <Route path="bills" element={<BillsPage />} />
        <Route path="addresses" element={<AddressesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
      </Route>
    </Routes>
  );
}
