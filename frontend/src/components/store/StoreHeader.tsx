import { type FormEvent, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import { useCart } from "../../store/cartStore";
import { DemoUser, getStoredUser, persistUser } from "../../store/accountStorage";

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin1234";

export default function StoreHeader() {
  const { totalItems, toggleCart } = useCart();
  const [user, setUser] = useState<DemoUser | null>(() => getStoredUser());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginValues, setLoginValues] = useState({ email: "", password: "" });
  const [registerValues, setRegisterValues] = useState({
    name: "",
    lastname: "",
    email: "",
    telephone: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("q") ?? searchParams.get("search") ?? "";
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
      nextParams.set("q", value);
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
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAuthMode("login");
    setLoginValues({ email: "", password: "" });
    setRegisterValues({ name: "", lastname: "", email: "", telephone: "" });
    setError(null);
    setSuccessMessage(null);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!loginValues.email || !loginValues.password) {
      setError("Ingresa correo y contraseña para continuar.");
      return;
    }

    const normalizedEmail = loginValues.email.trim().toLowerCase();

    if (
      normalizedEmail === ADMIN_EMAIL &&
      loginValues.password === ADMIN_PASSWORD
    ) {
      const adminUser: DemoUser = {
        email: normalizedEmail,
        name: "Administrador",
        role: "admin"
      };
      persistUser(adminUser);
      setUser(adminUser);
      handleCloseModal();
      return;
    }

    setIsSubmitting(true);
    try {
      const clients = await api.getClients();
      const matchingClient = clients.find(
        (client) => client.email?.trim().toLowerCase() === normalizedEmail
      );

      if (!matchingClient) {
        setError("No encontramos ese correo. Regístrate primero para ingresar.");
        return;
      }

      const fullName = `${matchingClient.name ?? ""} ${matchingClient.lastname ?? ""}`.trim();
      const customerUser: DemoUser = {
        email: normalizedEmail,
        name: fullName || "Cliente",
        role: "customer",
        clientId: matchingClient.id_key
      };
      persistUser(customerUser);
      setUser(customerUser);
      handleCloseModal();
    } catch {
      setError("No fue posible validar el ingreso en este momento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!registerValues.name || !registerValues.lastname || !registerValues.email) {
      setError("Completa nombre, apellido y correo para registrarte.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createClient({
        name: registerValues.name.trim(),
        lastname: registerValues.lastname.trim(),
        email: registerValues.email.trim().toLowerCase(),
        telephone: registerValues.telephone.trim() || null
      });
      setSuccessMessage("Tu cuenta fue creada con éxito.");
      setAuthMode("login");
      setLoginValues({ email: registerValues.email.trim().toLowerCase(), password: "" });
      setRegisterValues({ name: "", lastname: "", email: "", telephone: "" });
    } catch {
      setError("No fue posible completar el registro. Verifica el correo e inténtalo otra vez.");
    } finally {
      setIsSubmitting(false);
    }
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
              <NavLink className="store-ghost" to="/store/account">
                Mi cuenta
              </NavLink>
              {user.role === "admin" ? (
                <NavLink className="store-admin-link" to="/dashboard">
                  Panel de administración
                </NavLink>
              ) : null}
              <button type="button" className="store-ghost" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button type="button" className="store-cart-button" onClick={handleOpenModal}>
              Iniciar sesión
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
            <div className="store-modal-actions">
              <button
                type="button"
                className={authMode === "login" ? "store-button" : "store-ghost"}
                onClick={() => {
                  setAuthMode("login");
                  setError(null);
                  setSuccessMessage(null);
                }}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                className={authMode === "register" ? "store-button" : "store-ghost"}
                onClick={() => {
                  setAuthMode("register");
                  setError(null);
                  setSuccessMessage(null);
                }}
              >
                Registrarse
              </button>
            </div>
            <form
              className="store-modal-form"
              onSubmit={authMode === "login" ? handleLogin : handleRegister}
            >
              {authMode === "login" ? (
                <>
                  <label>
                    Correo electrónico
                    <input
                      type="email"
                      value={loginValues.email}
                      onChange={(event) =>
                        setLoginValues((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder="cliente@correo.com"
                    />
                  </label>
                  <label>
                    Contraseña
                    <input
                      type="password"
                      value={loginValues.password}
                      onChange={(event) =>
                        setLoginValues((prev) => ({ ...prev, password: event.target.value }))
                      }
                      placeholder="Ingresa tu contraseña"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Nombre
                    <input
                      type="text"
                      value={registerValues.name}
                      onChange={(event) =>
                        setRegisterValues((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder="Tu nombre"
                    />
                  </label>
                  <label>
                    Apellido
                    <input
                      type="text"
                      value={registerValues.lastname}
                      onChange={(event) =>
                        setRegisterValues((prev) => ({ ...prev, lastname: event.target.value }))
                      }
                      placeholder="Tu apellido"
                    />
                  </label>
                  <label>
                    Correo electrónico
                    <input
                      type="email"
                      value={registerValues.email}
                      onChange={(event) =>
                        setRegisterValues((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder="cliente@correo.com"
                    />
                  </label>
                  <label>
                    Teléfono
                    <input
                      type="tel"
                      value={registerValues.telephone}
                      onChange={(event) =>
                        setRegisterValues((prev) => ({ ...prev, telephone: event.target.value }))
                      }
                      placeholder="Opcional"
                    />
                  </label>
                </>
              )}
              {error ? <p className="store-modal-error">{error}</p> : null}
              {successMessage ? <p>{successMessage}</p> : null}
              <div className="store-modal-actions">
                <button type="button" className="store-ghost" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="store-button" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Procesando..."
                    : authMode === "login"
                      ? "Entrar"
                      : "Crear cuenta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </header>
  );
}
