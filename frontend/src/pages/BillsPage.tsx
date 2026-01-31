import { FormEvent, useEffect, useState } from "react";
import { api, BillPayload } from "../api/client";
import { ApiBill } from "../api/types";

type BillFormState = {
  id_key?: number;
  bill_number: string;
  discount: string;
  date: string;
  total: string;
  payment_type: string;
  client_id: string;
};

const formatDateForInput = (isoDate: string) => {
  if (!isoDate) {
    return "";
  }
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(
    parsed.getDate()
  )}`;
};

const emptyForm: BillFormState = {
  bill_number: "",
  discount: "",
  date: formatDateForInput(new Date().toISOString()),
  total: "",
  payment_type: "1",
  client_id: ""
};

const paymentLabels: Record<number, string> = {
  1: "Efectivo",
  2: "Tarjeta",
  3: "Débito",
  4: "Crédito",
  5: "Transferencia"
};

export default function BillsPage() {
  const [bills, setBills] = useState<ApiBill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<BillFormState>(emptyForm);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const loadBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBills();
      setBills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const billNumber = formState.bill_number.trim();
    const discountValue = formState.discount.trim();
    const dateValue = formState.date.trim();
    const totalValue = Number(formState.total);
    const paymentValue = Number(formState.payment_type);
    const clientValue = Number(formState.client_id);

    if (!billNumber) {
      setError("El número de factura es obligatorio.");
      return;
    }

    if (!dateValue) {
      setError("La fecha es obligatoria.");
      return;
    }

    if (Number.isNaN(totalValue) || totalValue < 0) {
      setError("El total debe ser un número válido.");
      return;
    }

    if (!Number.isInteger(paymentValue) || paymentValue <= 0) {
      setError("El tipo de pago debe ser válido.");
      return;
    }

    if (!Number.isInteger(clientValue) || clientValue <= 0) {
      setError("El cliente debe ser un ID válido.");
      return;
    }

    let parsedDiscount: number | null = null;
    if (discountValue) {
      const numericDiscount = Number(discountValue);
      if (Number.isNaN(numericDiscount) || numericDiscount < 0) {
        setError("El descuento debe ser un número válido.");
        return;
      }
      parsedDiscount = numericDiscount;
    }

    setFormLoading(true);
    setError(null);
    try {
      const payload: BillPayload = {
        bill_number: billNumber,
        discount: parsedDiscount,
        date: dateValue,
        total: totalValue,
        payment_type: paymentValue,
        client_id: clientValue
      };
      if (formState.id_key) {
        await api.updateBill(formState.id_key, payload);
      } else {
        await api.createBill(payload);
      }
      setFormState(emptyForm);
      await loadBills();
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
      const bill = await api.getBill(idKey);
      setFormState({
        id_key: bill.id_key,
        bill_number: bill.bill_number,
        discount: bill.discount === null ? "" : String(bill.discount),
        date: formatDateForInput(bill.date),
        total: String(bill.total),
        payment_type: String(bill.payment_type),
        client_id: String(bill.client_id)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (idKey: number) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta factura?"
    );
    if (!confirmed) {
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      await api.deleteBill(idKey);
      await loadBills();
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
          <h1>Facturas</h1>
          <p>Administra facturas y métodos de pago.</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="content-grid">
        <div className="card">
          <h2>{isEditing ? "Editar factura" : "Crear factura"}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Número de factura</span>
              <input
                type="text"
                value={formState.bill_number}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    bill_number: event.target.value
                  }))
                }
                placeholder="FAC-0001"
                required
              />
            </label>
            <label className="field">
              <span>Fecha</span>
              <input
                type="date"
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
              <span>Descuento</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formState.discount}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    discount: event.target.value
                  }))
                }
                placeholder="0.00"
              />
            </label>
            <label className="field">
              <span>Tipo de pago</span>
              <select
                value={formState.payment_type}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    payment_type: event.target.value
                  }))
                }
              >
                <option value="1">Efectivo</option>
                <option value="2">Tarjeta</option>
                <option value="3">Débito</option>
                <option value="4">Crédito</option>
                <option value="5">Transferencia</option>
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
          {loading ? <p>Cargando facturas...</p> : null}
          {!loading && bills.length === 0 ? (
            <p className="empty">No hay facturas cargadas.</p>
          ) : null}
          {!loading && bills.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Número</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Descuento</th>
                  <th>Pago</th>
                  <th>Cliente</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id_key}>
                    <td>{bill.id_key}</td>
                    <td>{bill.bill_number}</td>
                    <td>
                      {new Date(bill.date).toLocaleDateString("es-AR", {
                        dateStyle: "medium"
                      })}
                    </td>
                    <td>{bill.total.toFixed(2)}</td>
                    <td>
                      {bill.discount === null
                        ? "—"
                        : bill.discount.toFixed(2)}
                    </td>
                    <td>{paymentLabels[bill.payment_type] ?? "—"}</td>
                    <td>{bill.client_id}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() => handleEdit(bill.id_key)}
                        disabled={formLoading}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(bill.id_key)}
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
