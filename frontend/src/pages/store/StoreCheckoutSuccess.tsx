import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatters";
import {
  clearStoredCheckoutSummary,
  getStoredCheckoutSummary,
  type CheckoutSummary,
} from "../../store/checkoutStorage";

export default function StoreCheckoutSuccess() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);

  useEffect(() => {
    const storedSummary = getStoredCheckoutSummary();
    if (!storedSummary) {
      navigate("/store/products", { replace: true });
      return;
    }

    setSummary(storedSummary);
  }, [navigate]);

  const purchaseDate = useMemo(() => {
    if (!summary?.purchasedAt) {
      return null;
    }

    const parsedDate = new Date(summary.purchasedAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toLocaleString("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [summary?.purchasedAt]);

  if (!summary) {
    return null;
  }

  return (
    <section className="store-account">
      <header className="store-account-header">
        <div>
          <p className="store-pill">Checkout</p>
          <h1>Compra realizada con éxito</h1>
          <p className="store-muted">
            Gracias por tu compra, {summary.customerName}. Ya dejamos el resumen listo para tu
            presentación.
          </p>
        </div>
        <Link className="store-button" to="/store/products">
          Seguir comprando
        </Link>
      </header>

      <div className="store-account-grid">
        <article className="store-account-card">
          <h3>Cliente</h3>
          <p className="store-muted">{summary.customerName}</p>
          <p className="store-muted">{summary.customerEmail}</p>
          {purchaseDate ? (
            <p className="store-feedback">Fecha de compra: {purchaseDate}</p>
          ) : null}
        </article>

        <article className="store-account-card">
          <h3>Entrega</h3>
          <p className="store-muted">{summary.address}</p>
          <p className="store-feedback">Total pagado: {formatPrice(summary.total)}</p>
        </article>
      </div>

      <article className="store-account-card">
        <h3>Productos comprados</h3>
        <ul className="store-cart-items">
          {summary.items.map((item) => (
            <li key={item.id} className="store-cart-item">
              <div className="store-cart-thumb">
                <img src={item.imageSrc} alt={item.name} />
              </div>
              <div className="store-cart-info">
                <h3>{item.name}</h3>
                <p className="store-muted">{item.categoryName}</p>
                <p className="store-feedback">
                  Cantidad: {item.quantity} · Subtotal: {formatPrice(item.quantity * item.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="store-account-actions">
          <p className="store-cart-total">Total: {formatPrice(summary.total)}</p>
          <button
            type="button"
            className="store-ghost"
            onClick={() => {
              clearStoredCheckoutSummary();
              navigate("/store");
            }}
          >
            Volver al inicio
          </button>
        </div>
      </article>
    </section>
  );
}
