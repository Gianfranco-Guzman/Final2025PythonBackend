import { FormEvent, useEffect, useState } from "react";
import { api, ClientPayload } from "../api/client";
import { ApiClient } from "../api/types";

type ClientFormState = {
  id_key?: number;
  name: ClientPayload["name"];
  lastname: ClientPayload["lastname"];
  email: ClientPayload["email"];
  telephone: string;
};

const emptyForm: ClientFormState = {
  name: "",
  lastname: "",
  email: "",
  telephone: ""
};

const phonePattern = /^\+?[1-9]\d{6,19}$/;

export default function ClientsPage() {
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<ClientFormState>(emptyForm);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = formState.name.trim();
    const trimmedLastname = formState.lastname.trim();
    const trimmedEmail = formState.email.trim();
    const trimmedTelephone = formState.telephone.trim();

    if (!trimmedName || !trimmedLastname) {
      setError("El nombre y el apellido son obligatorios.");
      return;
    }

    if (!trimmedEmail) {
      setError("El email es obligatorio.");
      return;
    }

    if (trimmedTelephone && !phonePattern.test(trimmedTelephone)) {
      setError("El teléfono debe tener entre 7 y 20 dígitos.");
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      const payload: ClientPayload = {
        name: trimmedName,
        lastname: trimmedLastname,
        email: trimmedEmail,
        telephone: trimmedTelephone ? trimmedTelephone : null
      };
      if (formState.id_key) {
        await api.updateClient(formState.id_key, payload);
      } else {
        await api.createClient(payload);
      }
      setFormState(emptyForm);
      await loadClients();
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
      const client = await api.getClient(idKey);
      setFormState({
        id_key: client.id_key,
        name: client.name ?? "",
        lastname: client.lastname ?? "",
        email: client.email ?? "",
        telephone: client.telephone ?? ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (idKey: number) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este cliente?"
    );
    if (!confirmed) {
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      await api.deleteClient(idKey);
      await loadClients();
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
          <h1>Clientes</h1>
          <p>Gestiona clientes con operaciones CRUD completas.</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="content-grid">
        <div className="card">
          <h2>{isEditing ? "Editar cliente" : "Crear cliente"}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Nombre</span>
              <input
                type="text"
                value={formState.name}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    name: event.target.value
                  }))
                }
                placeholder="Nombre"
                required
              />
            </label>
            <label className="field">
              <span>Apellido</span>
              <input
                type="text"
                value={formState.lastname}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    lastname: event.target.value
                  }))
                }
                placeholder="Apellido"
                required
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    email: event.target.value
                  }))
                }
                placeholder="correo@ejemplo.com"
                required
              />
            </label>
            <label className="field">
              <span>Teléfono</span>
              <input
                type="tel"
                value={formState.telephone}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    telephone: event.target.value
                  }))
                }
                placeholder="+5491122334455"
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
          {loading ? <p>Cargando clientes...</p> : null}
          {!loading && clients.length === 0 ? (
            <p className="empty">No hay clientes cargados.</p>
          ) : null}
          {!loading && clients.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id_key}>
                    <td>{client.id_key}</td>
                    <td>{client.name ?? "—"}</td>
                    <td>{client.lastname ?? "—"}</td>
                    <td>{client.email ?? "—"}</td>
                    <td>{client.telephone ?? "—"}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() => handleEdit(client.id_key)}
                        disabled={formLoading}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(client.id_key)}
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
