import { type FormEvent, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../store/cartStore";

type DemoUser = {
  email: string;
  name: string;
  role: "admin" | "customer";
};

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin1234";
const STORAGE_USER_KEY = "demoUser";
const STORAGE_ADMIN_KEY = "isAdmin";

const getStoredUser = (): DemoUser | null => {
  const raw = localStorage.getItem(STORAGE_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
};

const persistUser = (user: DemoUser | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_ADMIN_KEY);
    return;
  }

  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(STORAGE_ADMIN_KEY, String(user.role === "admin"));
};

export default function StoreHeader() {
  const { totalItems, toggleCart } = useCart();
  const [user, setUser] = useState<DemoUser | null>(() => getStoredUser());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [searchValue, setSearchValue] = useState(initialSearch);

  useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    if (user) {
      return;
    }

    const state = location.state as { openLogin?: boolean } | null;
    const searchParams = new URLSearchParams(location.search);
    const shouldOpen =
      Boolean(state?.openLogin) || searchParams.get("login") === "1";

    if (shouldOpen) {
      setIsModalOpen(true);
      setError(null);
      if (state?.openLogin) {
        navigate(location.pathname + location.search, {
          replace: true,
          state: {},
        });
      }
    }
  }, [location, navigate, user]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    const category = searchParams.get("category");
    const nextParams = new URLSearchParams();
    if (value.trim()) {
      nextParams.set("search", value);
    }
    if (category) {
      nextParams.set("category", category);
    }
    const query = nextParams.toString();
    const target = `/store/products${query ? `?${query}` : ""}`;
    navigate(target, { replace: location.pathname === "/store/products" });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormValues({ email: "", password: "" });
    setError(null);
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.email || !formValues.password) {
      setError("Ingresa correo y contraseña para continuar.");
      return;
    }

    if (
      formValues.email.trim().toLowerCase() === ADMIN_EMAIL &&
      formValues.password === ADMIN_PASSWORD
    ) {
      const adminUser: DemoUser = {
        email: formValues.email.trim().toLowerCase(),
        name: "Administrador",
        role: "admin",
      };
      persistUser(adminUser);
      setUser(adminUser);
      handleCloseModal();
      return;
    }

    const customerUser: DemoUser = {
      email: formValues.email.trim().toLowerCase(),
      name: "Cliente",
      role: "customer",
    };
    persistUser(customerUser);
    setUser(customerUser);
    handleCloseModal();
  };

  const handleLogout = () => {
    persistUser(null);
    setUser(null);
  };

  return (
    <header className="store-header">
      <div className="store-topbar">
        <NavLink className="store-brand" to="/store">
          TECHSTORE
        </NavLink>
        <label className="store-search">
          <input
            type="search"
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Buscar productos"
          />
        </label>
        <div className="store-auth">
          <button type="button" className="store-cart-button" onClick={toggleCart}>
            🛒 Carrito
            {totalItems > 0 ? (
              <span className="store-cart-count">{totalItems}</span>
            ) : null}
          </button>
          {user ? (
            <div className="store-auth-info">
              <span className="store-auth-name">{user.name}</span>
              {user.role === "admin" ? (
                <NavLink className="store-admin-link" to="/dashboard">
                  Admin
                </NavLink>
              ) : null}
              <button type="button" className="store-ghost" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button type="button" className="store-cart-button" onClick={handleOpenModal}>
              Ingresar
            </button>
          )}
        </div>
      </div>

      {isModalOpen ? (
        <div className="store-modal" role="dialog" aria-modal="true">
          <div className="store-modal-card">
            <div className="store-modal-header">
              <div>
                <p className="store-modal-overline">Ingreso</p>
                <h2>Acceso a TECHSTORE</h2>
              </div>
              <button
                type="button"
                className="store-modal-close"
                onClick={handleCloseModal}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <form className="store-modal-form" onSubmit={handleLogin}>
              <label>
                Correo
                <input
                  type="email"
                  value={formValues.email}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="cliente@correo.com"
                />
              </label>
              <label>
                Contraseña
                <input
                  type="password"
                  value={formValues.password}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, password: event.target.value }))
                  }
                  placeholder="Ingresa tu contraseña"
                />
              </label>
              {error ? <p className="store-modal-error">{error}</p> : null}
              <div className="store-modal-actions">
                <button type="button" className="store-ghost" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="store-button">
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </header>
  );
}
