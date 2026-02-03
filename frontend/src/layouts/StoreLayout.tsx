import { NavLink, Outlet } from "react-router-dom";

export default function StoreLayout() {
  return (
    <div className="store-app">
      <header className="store-header">
        <div>
          <p className="store-overline">TechStore</p>
          <h1>Tienda demo</h1>
        </div>
        <nav className="store-nav">
          <NavLink
            to="/store"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/store/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Productos
          </NavLink>
        </nav>
      </header>

      <main className="store-content">
        <Outlet />
      </main>
    </div>
  );
}
