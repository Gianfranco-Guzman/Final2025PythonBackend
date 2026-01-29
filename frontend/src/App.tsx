import { NavLink, Route, Routes } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/ProductsPage";

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
        </nav>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </main>
    </div>
  );
}
