import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleExitAdmin = () => {
    localStorage.removeItem("demoUser");
    localStorage.removeItem("isAdmin");
    navigate("/store");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="overline">E-commerce API</p>
          <h1>Panel de administración</h1>
        </div>
        <div className="admin-actions">
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
          <button type="button" className="admin-exit" onClick={handleExitAdmin}>
            Salir del panel
          </button>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
