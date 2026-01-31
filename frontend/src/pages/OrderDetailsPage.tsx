import { FormEvent, useEffect, useState } from "react";
import { api, OrderDetailPayload } from "../api/client";
import { ApiOrderDetail } from "../api/types";

type OrderDetailFormState = {
  id_key?: number;
  quantity: string;
  price: string;
  order_id: string;
  product_id: string;
};

const emptyForm: OrderDetailFormState = {
  quantity: "",
  price: "",
  order_id: "",
  product_id: ""
};

export default function OrderDetailsPage() {
  const [orderDetails, setOrderDetails] = useState<ApiOrderDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<OrderDetailFormState>(emptyForm);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const loadOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrderDetails();
      setOrderDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderDetails();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantityValue = Number(formState.quantity);
    const priceValue = formState.price.trim()
      ? Number(formState.price)
      : null;
    const orderValue = Number(formState.order_id);
    const productValue = Number(formState.product_id);

    if (!Number.isInteger(quantityValue) || quantityValue <= 0) {
      setError("La cantidad debe ser un entero válido.");
      return;
    }

    if (priceValue !== null && (Number.isNaN(priceValue) || priceValue <= 0)) {
      setError("El precio debe ser un número positivo.");
      return;
    }

    if (!Number.isInteger(orderValue) || orderValue <= 0) {
      setError("La orden debe ser un ID válido.");
      return;
    }

    if (!Number.isInteger(productValue) || productValue <= 0) {
      setError("El producto debe ser un ID válido.");
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      const payload: OrderDetailPayload = {
        quantity: quantityValue,
        price: priceValue,
        order_id: orderValue,
        product_id: productValue
      };
      if (formState.id_key) {
        await api.updateOrderDetail(formState.id_key, payload);
      } else {
        await api.createOrderDetail(payload);
      }
      setFormState(emptyForm);
      await loadOrderDetails();
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
      const detail = await api.getOrderDetail(idKey);
      setFormState({
        id_key: detail.id_key,
        quantity: String(detail.quantity),
        price: detail.price ? String(detail.price) : "",
        order_id: String(detail.order_id),
        product_id: String(detail.product_id)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (idKey: number) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este detalle?"
    );
    if (!confirmed) {
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      await api.deleteOrderDetail(idKey);
      await loadOrderDetails();
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
          <h1>Detalles de orden</h1>
          <p>Administra los productos vendidos dentro de cada orden.</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="content-grid">
        <div className="card">
          <h2>{isEditing ? "Editar detalle" : "Crear detalle"}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Cantidad</span>
              <input
                type="number"
                min="1"
                step="1"
                value={formState.quantity}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    quantity: event.target.value
                  }))
                }
                placeholder="1"
                required
              />
            </label>
            <label className="field">
              <span>Precio (opcional)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formState.price}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    price: event.target.value
                  }))
                }
                placeholder="0.00"
              />
            </label>
            <label className="field">
              <span>Orden (ID)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={formState.order_id}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    order_id: event.target.value
                  }))
                }
                placeholder="ID de orden"
                required
              />
            </label>
            <label className="field">
              <span>Producto (ID)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={formState.product_id}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    product_id: event.target.value
                  }))
                }
                placeholder="ID de producto"
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
          {loading ? <p>Cargando detalles...</p> : null}
          {!loading && orderDetails.length === 0 ? (
            <p className="empty">No hay detalles cargados.</p>
          ) : null}
          {!loading && orderDetails.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Orden</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((detail) => (
                  <tr key={detail.id_key}>
                    <td>{detail.id_key}</td>
                    <td>{detail.order_id}</td>
                    <td>{detail.product_id}</td>
                    <td>{detail.quantity}</td>
                    <td>{detail.price ? detail.price.toFixed(2) : "—"}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() => handleEdit(detail.id_key)}
                        disabled={formLoading}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(detail.id_key)}
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
