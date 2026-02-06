import { type FormEvent, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import {
  getStoredCard,
  getStoredUser,
  persistCard,
  type DemoUser,
  type SavedCard,
} from "../../store/accountStorage";

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

const emptyCardForm: SavedCard = {
  holderName: "",
  cardNumber: "",
  expiry: "",
};

const maskCard = (cardNumber: string) => {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 4) {
    return "****";
  }
  return `**** **** **** ${digits.slice(-4)}`;
};

export default function StoreAccount() {
  const navigate = useNavigate();
  const [user] = useState<DemoUser | null>(() => getStoredUser());
  const [addressId, setAddressId] = useState<number | null>(null);
  const [addressSummary, setAddressSummary] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormValues>(emptyAddressForm);
  const [card, setCard] = useState<SavedCard | null>(() => getStoredCard());
  const [cardForm, setCardForm] = useState<SavedCard>(emptyCardForm);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);
  const [addressMessage, setAddressMessage] = useState<string | null>(null);
  const [cardMessage, setCardMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/store", { replace: true, state: { openLogin: true } });
    }
  }, [navigate, user]);

  useEffect(() => {
    if (!user?.clientId) {
      return;
    }

    let isMounted = true;

    const loadAddress = async () => {
      setIsLoadingAddress(true);
      try {
        const addresses = await api.getAddresses();
        const latestAddress = addresses
          .filter((address) => address.client_id === user.clientId)
          .sort((first, second) => second.id_key - first.id_key)[0];

        if (!isMounted) {
          return;
        }

        if (!latestAddress) {
          setAddressId(null);
          setAddressSummary(null);
          return;
        }

        setAddressId(latestAddress.id_key);
        const summary = [latestAddress.street, latestAddress.number, latestAddress.city]
          .filter(Boolean)
          .join(", ");
        setAddressSummary(summary || "Dirección registrada");
      } catch {
        if (!isMounted) {
          return;
        }
        setAddressMessage("No fue posible cargar tu dirección actual.");
      } finally {
        if (isMounted) {
          setIsLoadingAddress(false);
        }
      }
    };

    void loadAddress();

    return () => {
      isMounted = false;
    };
  }, [user?.clientId]);

  const handleSaveAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddressMessage(null);

    if (!user?.clientId) {
      setAddressMessage("Debes iniciar sesión para guardar una dirección.");
      return;
    }

    if (!addressForm.street.trim() || !addressForm.number.trim() || !addressForm.city.trim()) {
      setAddressMessage("Completa calle, número y ciudad.");
      return;
    }

    setIsSubmittingAddress(true);
    try {
      const savedAddress = await api.createAddress({
        street: addressForm.street.trim(),
        number: addressForm.number.trim(),
        city: addressForm.city.trim(),
        client_id: user.clientId,
      });
      setAddressId(savedAddress.id_key);
      setAddressSummary(
        `${savedAddress.street ?? ""}, ${savedAddress.number ?? ""}, ${savedAddress.city ?? ""}`,
      );
      setAddressMessage("Dirección guardada correctamente.");
      setAddressForm(emptyAddressForm);
    } catch {
      setAddressMessage("No se pudo guardar la dirección. Intenta nuevamente.");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handleSaveCard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCardMessage(null);

    if (!cardForm.holderName.trim() || !cardForm.cardNumber.trim() || !cardForm.expiry.trim()) {
      setCardMessage("Completa titular, número y vencimiento.");
      return;
    }

    setIsSubmittingCard(true);
    const nextCard = {
      holderName: cardForm.holderName.trim(),
      cardNumber: cardForm.cardNumber.trim(),
      expiry: cardForm.expiry.trim(),
    };
    persistCard(nextCard);
    setCard(nextCard);
    setCardForm(emptyCardForm);
    setCardMessage("Tarjeta guardada localmente para esta demo.");
    setIsSubmittingCard(false);
  };

  if (!user) {
    return null;
  }

  return (
    <section className="store-account">
      <div className="store-account-header">
        <div>
          <p className="store-pill">Mi cuenta</p>
          <h2>Hola, {user.name}</h2>
          <p className="store-muted">Gestiona tu perfil de compra para un checkout más rápido.</p>
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
          <div className="store-account-row">
            <span>ID cliente</span>
            <strong>{user.clientId ?? "N/A"}</strong>
          </div>
        </div>

        <div className="store-account-card">
          <h3>Dirección principal</h3>
          <p className="store-muted">
            {isLoadingAddress
              ? "Consultando dirección..."
              : addressSummary ?? "Todavía no tienes una dirección registrada."}
          </p>
          {addressId ? <p className="store-feedback">Dirección ID: #{addressId}</p> : null}
          <form className="store-account-form" onSubmit={handleSaveAddress}>
            <label>
              Calle
              <input
                type="text"
                value={addressForm.street}
                onChange={(event) =>
                  setAddressForm((prev) => ({ ...prev, street: event.target.value }))
                }
                placeholder="Av. Siempre Viva"
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
                placeholder="742"
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
                placeholder="Springfield"
              />
            </label>
            <button type="submit" className="store-button" disabled={isSubmittingAddress}>
              {isSubmittingAddress ? "Guardando..." : "Guardar dirección"}
            </button>
          </form>
          {addressMessage ? <p className="store-feedback">{addressMessage}</p> : null}
        </div>

        <div className="store-account-card">
          <h3>Tarjeta de pago (demo)</h3>
          <p className="store-muted">
            {card
              ? `${card.holderName} · ${maskCard(card.cardNumber)} · Vence ${card.expiry}`
              : "No hay tarjeta guardada todavía."}
          </p>
          <form className="store-account-form" onSubmit={handleSaveCard}>
            <label>
              Titular
              <input
                type="text"
                value={cardForm.holderName}
                onChange={(event) =>
                  setCardForm((prev) => ({ ...prev, holderName: event.target.value }))
                }
                placeholder="Nombre como figura en la tarjeta"
              />
            </label>
            <label>
              Número de tarjeta
              <input
                type="text"
                value={cardForm.cardNumber}
                onChange={(event) =>
                  setCardForm((prev) => ({ ...prev, cardNumber: event.target.value }))
                }
                placeholder="4111 1111 1111 1111"
              />
            </label>
            <label>
              Vencimiento
              <input
                type="text"
                value={cardForm.expiry}
                onChange={(event) =>
                  setCardForm((prev) => ({ ...prev, expiry: event.target.value }))
                }
                placeholder="MM/AA"
              />
            </label>
            <button type="submit" className="store-button" disabled={isSubmittingCard}>
              {isSubmittingCard ? "Guardando..." : "Guardar tarjeta"}
            </button>
          </form>
          {cardMessage ? <p className="store-feedback">{cardMessage}</p> : null}
        </div>
      </div>
    </section>
  );
}
