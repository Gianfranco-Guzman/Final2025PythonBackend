import { NavLink, Route, Routes } from "react-router-dom";
import AddressesPage from "./pages/AddressesPage";
import BillsPage from "./pages/BillsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ClientsPage from "./pages/ClientsPage";
import Dashboard from "./pages/Dashboard";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import ReviewsPage from "./pages/ReviewsPage";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="overline">E-commerce API</p>
          <h1>Panel de administración</h1>
        </div>
        <nav className="nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Categorías
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Productos
          </NavLink>
          <NavLink
            to="/clients"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Clientes
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Órdenes
          </NavLink>
          <NavLink
            to="/order-details"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Detalles de orden
          </NavLink>
          <NavLink
            to="/bills"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Facturas
          </NavLink>
          <NavLink
            to="/addresses"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Direcciones
          </NavLink>
          <NavLink
            to="/reviews"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Reviews
          </NavLink>
        </nav>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/order-details" element={<OrderDetailsPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
      </main>
    </div>
  );
}
