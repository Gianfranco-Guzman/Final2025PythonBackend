import { FormEvent, useEffect, useState } from "react";
import { api, OrderPayload } from "../api/client";
import { ApiOrder } from "../api/types";

type OrderFormState = {
  id_key?: number;
  date: string;
  total: string;
  delivery_method: string;
  status: string;
  client_id: string;
  bill_id: string;
};

const formatDateForInput = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(
    parsed.getDate()
  )}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
};

const emptyForm: OrderFormState = {
  date: formatDateForInput(new Date().toISOString()),
  total: "",
  delivery_method: "1",
  status: "1",
  client_id: "",
  bill_id: ""
};

const deliveryLabels: Record<number, string> = {
  1: "Drive Thru",
  2: "En mano",
  3: "Delivery"
};

const statusLabels: Record<number, string> = {
  1: "Pendiente",
  2: "En progreso",
  3: "Entregado",
  4: "Cancelado"
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<OrderFormState>(emptyForm);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedDate = formState.date.trim();
    const totalValue = Number(formState.total);
    const deliveryValue = Number(formState.delivery_method);
    const statusValue = Number(formState.status);
    const clientValue = Number(formState.client_id);
    const billValue = Number(formState.bill_id);

    if (!trimmedDate) {
      setError("La fecha es obligatoria.");
      return;
    }

    if (Number.isNaN(totalValue) || totalValue < 0) {
      setError("El total debe ser un número válido.");
      return;
    }

    if (!Number.isInteger(deliveryValue) || deliveryValue <= 0) {
      setError("El método de entrega debe ser válido.");
      return;
    }

    if (!Number.isInteger(statusValue) || statusValue <= 0) {
      setError("El estado debe ser válido.");
      return;
    }

    if (!Number.isInteger(clientValue) || clientValue <= 0) {
      setError("El cliente debe ser un ID válido.");
      return;
    }

    if (!Number.isInteger(billValue) || billValue <= 0) {
      setError("La factura debe ser un ID válido.");
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      const payload: OrderPayload = {
        date: new Date(trimmedDate).toISOString(),
        total: totalValue,
        delivery_method: deliveryValue,
        status: statusValue,
        client_id: clientValue,
        bill_id: billValue
      };
      if (formState.id_key) {
        await api.updateOrder(formState.id_key, payload);
      } else {
        await api.createOrder(payload);
      }
      setFormState(emptyForm);
      await loadOrders();
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
      const order = await api.getOrder(idKey);
      setFormState({
        id_key: order.id_key,
        date: formatDateForInput(order.date),
        total: String(order.total),
        delivery_method: String(order.delivery_method),
        status: String(order.status),
        client_id: String(order.client_id),
        bill_id: String(order.bill_id)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (idKey: number) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta orden?"
    );
    if (!confirmed) {
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      await api.deleteOrder(idKey);
      await loadOrders();
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
          <h1>Órdenes</h1>
          <p>Gestiona órdenes con CRUD completo y datos de clientes.</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="content-grid">
        <div className="card">
          <h2>{isEditing ? "Editar orden" : "Crear orden"}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Fecha</span>
              <input
                type="datetime-local"
                value={formState.date}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    date: event.target.value
                  }))
                }
                required
              />
            </label>
            <label className="field">
              <span>Total</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formState.total}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    total: event.target.value
                  }))
                }
                placeholder="0.00"
                required
              />
            </label>
            <label className="field">
              <span>Método de entrega</span>
              <select
                value={formState.delivery_method}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    delivery_method: event.target.value
                  }))
                }
              >
                <option value="1">Drive Thru</option>
                <option value="2">En mano</option>
                <option value="3">Delivery</option>
              </select>
            </label>
            <label className="field">
              <span>Estado</span>
              <select
                value={formState.status}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    status: event.target.value
                  }))
                }
              >
                <option value="1">Pendiente</option>
                <option value="2">En progreso</option>
                <option value="3">Entregado</option>
                <option value="4">Cancelado</option>
              </select>
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
            <label className="field">
              <span>Factura (ID)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={formState.bill_id}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    bill_id: event.target.value
                  }))
                }
                placeholder="ID de factura"
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
          {loading ? <p>Cargando órdenes...</p> : null}
          {!loading && orders.length === 0 ? (
            <p className="empty">No hay órdenes cargadas.</p>
          ) : null}
          {!loading && orders.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Cliente</th>
                  <th>Factura</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id_key}>
                    <td>{order.id_key}</td>
                    <td>
                      {new Date(order.date).toLocaleString("es-AR", {
                        dateStyle: "short",
                        timeStyle: "short"
                      })}
                    </td>
                    <td>{order.total.toFixed(2)}</td>
                    <td>{deliveryLabels[order.delivery_method] ?? "—"}</td>
                    <td>{statusLabels[order.status] ?? "—"}</td>
                    <td>{order.client_id}</td>
                    <td>{order.bill_id}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() => handleEdit(order.id_key)}
                        disabled={formLoading}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(order.id_key)}
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
