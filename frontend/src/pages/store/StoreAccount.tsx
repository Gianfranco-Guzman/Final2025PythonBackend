import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

type DemoUser = {
  email: string;
  name: string;
  role: "admin" | "customer";
};

const STORAGE_USER_KEY = "demoUser";

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

export default function StoreAccount() {
  const navigate = useNavigate();
  const [user] = useState<DemoUser | null>(() => getStoredUser());

  useEffect(() => {
    if (!user) {
      navigate("/store", { replace: true, state: { openLogin: true } });
    }
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <section className="store-account">
      <div className="store-account-header">
        <div>
          <p className="store-pill">Mi cuenta</p>
          <h2>Hola, {user.name}</h2>
          <p className="store-muted">
            Puedes seguir comprando o acceder al panel si eres administrador.
          </p>
        </div>
        <NavLink className="store-button" to="/store/products">
          Seguir comprando
        </NavLink>
      </div>

      <div className="store-account-grid">
        <div className="store-account-card">
          <h3>Datos de la sesión</h3>
          <div className="store-account-row">
            <span>Nombre</span>
            <strong>{user.name}</strong>
          </div>
          <div className="store-account-row">
            <span>Correo</span>
            <strong>{user.email}</strong>
          </div>
          <div className="store-account-row">
            <span>Rol</span>
            <strong>{user.role === "admin" ? "Administrador" : "Cliente"}</strong>
          </div>
        </div>

        <div className="store-account-card">
          <h3>Accesos rápidos</h3>
          <p className="store-muted">
            Continúa explorando productos o vuelve al inicio de la tienda.
          </p>
          <div className="store-account-actions">
            <NavLink className="store-ghost" to="/store">
              Volver al inicio
            </NavLink>
            <NavLink className="store-ghost" to="/store/products">
              Ver productos
            </NavLink>
            {user.role === "admin" ? (
              <NavLink className="store-admin-link" to="/dashboard">
                Ir al admin
              </NavLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
