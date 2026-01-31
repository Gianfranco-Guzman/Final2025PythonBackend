import { FormEvent, useEffect, useState } from "react";
import { AddressPayload, api } from "../api/client";
import { ApiAddress } from "../api/types";

type AddressFormState = {
  id_key?: number;
  street: string;
  number: string;
  city: string;
  client_id: string;
};

const emptyForm: AddressFormState = {
  street: "",
  number: "",
  city: "",
  client_id: ""
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<AddressFormState>(emptyForm);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const loadAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const streetValue = formState.street.trim();
    const numberValue = formState.number.trim();
    const cityValue = formState.city.trim();
    const clientValue = Number(formState.client_id);

    if (!Number.isInteger(clientValue) || clientValue <= 0) {
      setError("El cliente debe ser un ID válido.");
      return;
    }

    const payload: AddressPayload = {
      street: streetValue ? streetValue : null,
      number: numberValue ? numberValue : null,
      city: cityValue ? cityValue : null,
      client_id: clientValue
    };

    setFormLoading(true);
    setError(null);
    try {
      if (formState.id_key) {
        await api.updateAddress(formState.id_key, payload);
      } else {
        await api.createAddress(payload);
      }
      setFormState(emptyForm);
      await loadAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (idKey: number) => {
    setFormLoading(true);
    setError(null);
    try {
      const address = await api.getAddress(idKey);
      setFormState({
        id_key: address.id_key,
        street: address.street ?? "",
        number: address.number ?? "",
        city: address.city ?? "",
        client_id: String(address.client_id)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (idKey: number) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta dirección?"
    );
    if (!confirmed) {
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      await api.deleteAddress(idKey);
      await loadAddresses();
      if (formState.id_key === idKey) {
        setFormState(emptyForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const isEditing = Boolean(formState.id_key);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Direcciones</h1>
          <p>Administra direcciones asociadas a clientes.</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="content-grid">
        <div className="card">
          <h2>{isEditing ? "Editar dirección" : "Crear dirección"}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Calle</span>
              <input
                type="text"
                value={formState.street}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    street: event.target.value
                  }))
                }
                placeholder="Av. Siempre Viva"
              />
            </label>
            <label className="field">
              <span>Número</span>
              <input
                type="text"
                value={formState.number}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    number: event.target.value
                  }))
                }
                placeholder="742"
              />
            </label>
            <label className="field">
              <span>Ciudad</span>
              <input
                type="text"
                value={formState.city}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    city: event.target.value
                  }))
                }
                placeholder="Springfield"
              />
            </label>
            <label className="field">
              <span>Cliente (ID)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={formState.client_id}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    client_id: event.target.value
                  }))
                }
                placeholder="ID de cliente"
                required
              />
            </label>
            <div className="form-actions">
              <button type="submit" disabled={formLoading}>
                {formLoading
                  ? "Guardando..."
                  : isEditing
                  ? "Guardar cambios"
                  : "Crear"}
              </button>
              {isEditing ? (
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setFormState(emptyForm)}
                  disabled={formLoading}
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Listado</h2>
          {loading ? <p>Cargando direcciones...</p> : null}
          {!loading && addresses.length === 0 ? (
            <p className="empty">No hay direcciones cargadas.</p>
          ) : null}
          {!loading && addresses.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Calle</th>
                  <th>Número</th>
                  <th>Ciudad</th>
                  <th>Cliente</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {addresses.map((address) => (
                  <tr key={address.id_key}>
                    <td>{address.id_key}</td>
                    <td>{address.street ?? "—"}</td>
                    <td>{address.number ?? "—"}</td>
                    <td>{address.city ?? "—"}</td>
                    <td>{address.client_id}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() => handleEdit(address.id_key)}
                        disabled={formLoading}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(address.id_key)}
                        disabled={formLoading}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </section>
    </div>
  );
}
