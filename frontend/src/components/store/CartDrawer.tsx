import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { getStoredCard, getStoredUser, type SavedCard } from "../../store/accountStorage";
import { useCart } from "../../store/cartStore";
import { formatPrice } from "../../utils/formatters";

type AddressFormValues = {
  street: string;
  number: string;
  city: string;
};

const emptyAddressForm: AddressFormValues = {
  street: "",
  number: "",
  city: "",
};

const maskCard = (cardNumber: string) => {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 4) {
    return "****";
  }
  return `**** **** **** ${digits.slice(-4)}`;
};

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalPrice, closeCart, removeItem, updateQuantity } =
    useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);
  const [addressSummary, setAddressSummary] = useState<string | null>(null);
  const [savedCard, setSavedCard] = useState<SavedCard | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormValues>(emptyAddressForm);
  const [addressMessage, setAddressMessage] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    setUserEmail(user?.email ?? null);
    setClientId(user?.clientId ?? null);
    setSavedCard(getStoredCard());

    if (!user?.clientId) {
      setAddressSummary(null);
      return;
    }

    let isMounted = true;
    const loadAddress = async () => {
      try {
        const addresses = await api.getAddresses();
        const latestAddress = addresses
          .filter((address) => address.client_id === user.clientId)
          .sort((first, second) => second.id_key - first.id_key)[0];

        if (!isMounted) {
          return;
        }

        if (!latestAddress) {
          setAddressSummary(null);
          return;
        }

        const summary = [latestAddress.street, latestAddress.number, latestAddress.city]
          .filter(Boolean)
          .join(", ");
        setAddressSummary(summary || "Dirección registrada");
      } catch {
        if (isMounted) {
          setAddressSummary(null);
        }
      }
    };

    void loadAddress();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleRequireLogin = () => {
    closeCart();
    navigate(`${location.pathname}${location.search}`, {
      state: { openLogin: true },
      replace: true,
    });
  };

  const handleSaveAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddressMessage(null);

    if (!clientId) {
      setAddressMessage("Necesitas iniciar sesión para guardar dirección.");
      return;
    }

    if (!addressForm.street.trim() || !addressForm.number.trim() || !addressForm.city.trim()) {
      setAddressMessage("Completa calle, número y ciudad.");
      return;
    }

    setIsSavingAddress(true);
    try {
      const saved = await api.createAddress({
        street: addressForm.street.trim(),
        number: addressForm.number.trim(),
        city: addressForm.city.trim(),
        client_id: clientId,
      });
      const summary = [saved.street, saved.number, saved.city].filter(Boolean).join(", ");
      setAddressSummary(summary || "Dirección registrada");
      setAddressForm(emptyAddressForm);
      setAddressMessage("Dirección guardada.");
    } catch {
      setAddressMessage("No se pudo guardar la dirección.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const isLoggedIn = Boolean(userEmail);
  const hasAddress = Boolean(addressSummary);
  const hasCard = Boolean(savedCard);

  return (
    <div className={`store-cart ${isOpen ? "store-cart-open" : ""}`}>
      <div className="store-cart-panel" role="dialog" aria-modal="true" aria-label="Carrito">
        <div className="store-cart-header">
          <div>
            <p className="store-pill">Carrito</p>
            <h2>Tu compra</h2>
            <p className="store-muted">
              {totalItems > 0
                ? `${totalItems} artículo${totalItems === 1 ? "" : "s"} en el carrito`
                : "Aún no agregas productos."}
            </p>
          </div>
          <button type="button" className="store-modal-close" onClick={closeCart} aria-label="Cerrar">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="store-card store-empty-state">
            <h3>Tu carrito está vacío</h3>
            <p>Explora los productos para sumar tu primera selección.</p>
            <Link className="store-button" to="/store/products" onClick={closeCart}>
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="store-cart-body">
            <ul className="store-cart-items">
              {items.map((item) => (
                <li key={item.id} className="store-cart-item">
                  <div className="store-cart-thumb">
                    <img src={item.imageSrc} alt={item.name} />
                  </div>
                  <div className="store-cart-info">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="store-muted">{item.categoryName}</p>
                    </div>
                    <p className="store-cart-price">{formatPrice(item.price)}</p>
                    <div className="store-cart-actions">
                      <button
                        type="button"
                        className="store-ghost"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="store-ghost"
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="store-cart-remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="store-cart-footer store-cart-footer-column">
              <div className="store-cart-checklist">
                <p className="store-muted">Estado de compra</p>
                <p className="store-feedback">
                  {isLoggedIn ? "✅ Sesión iniciada" : "⚠️ Inicia sesión para continuar"}
                </p>
                <p className="store-feedback">
                  {hasAddress ? `✅ Dirección: ${addressSummary}` : "⚠️ Falta dirección de entrega"}
                </p>
                <p className="store-feedback">
                  {hasCard
                    ? `✅ Tarjeta: ${savedCard?.holderName} · ${maskCard(savedCard?.cardNumber ?? "")}`
                    : "⚠️ Falta tarjeta guardada"}
                </p>
              </div>

              {!isLoggedIn ? (
                <button type="button" className="store-button" onClick={handleRequireLogin}>
                  Ingresar para finalizar
                </button>
              ) : !hasAddress ? (
                <form className="store-account-form" onSubmit={handleSaveAddress}>
                  <label>
                    Calle
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(event) =>
                        setAddressForm((prev) => ({ ...prev, street: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Número
                    <input
                      type="text"
                      value={addressForm.number}
                      onChange={(event) =>
                        setAddressForm((prev) => ({ ...prev, number: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Ciudad
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(event) =>
                        setAddressForm((prev) => ({ ...prev, city: event.target.value }))
                      }
                    />
                  </label>
                  <button type="submit" className="store-button" disabled={isSavingAddress}>
                    {isSavingAddress ? "Guardando..." : "Guardar dirección"}
                  </button>
                  {addressMessage ? <p className="store-feedback">{addressMessage}</p> : null}
                </form>
              ) : !hasCard ? (
                <div className="store-card store-empty-state">
                  <p className="store-muted">Guarda una tarjeta en Mi cuenta para finalizar la compra.</p>
                  <Link className="store-button" to="/store/account" onClick={closeCart}>
                    Ir a Mi cuenta
                  </Link>
                </div>
              ) : (
                <button type="button" className="store-button" disabled>
                  Finalizar compra
                </button>
              )}

              <div>
                <p className="store-muted">Total</p>
                <p className="store-cart-total">{formatPrice(totalPrice)}</p>
                <p className="store-feedback">Pago simulado para esta compra.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        className="store-cart-backdrop"
        aria-label="Cerrar carrito"
        onClick={closeCart}
      />
    </div>
  );
}
