import { FormEvent, useEffect, useState } from "react";
import { api, ProductPayload } from "../api/client";
import { ApiProduct } from "../api/types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD"
  }).format(value);

type ProductFormState = {
  id_key?: number;
  name: ProductPayload["name"];
  price: string;
  stock: string;
  category_id: string;
};

const emptyForm: ProductFormState = {
  name: "",
  price: "",
  stock: "",
  category_id: ""
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<ProductFormState>(emptyForm);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = formState.name.trim();
    if (!trimmedName) {
      setError("El nombre es obligatorio.");
      return;
    }

    const priceValue = Number(formState.price);
    const stockValue = Number(formState.stock);
    const categoryValue = Number(formState.category_id);

    if (Number.isNaN(priceValue) || priceValue < 0) {
      setError("El precio debe ser un número válido.");
      return;
    }

    if (!Number.isInteger(stockValue) || stockValue < 0) {
      setError("El stock debe ser un número entero válido.");
      return;
    }

    if (!Number.isInteger(categoryValue) || categoryValue <= 0) {
      setError("La categoría debe ser un ID válido.");
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      const payload: ProductPayload = {
        name: trimmedName,
        price: priceValue,
        stock: stockValue,
        category_id: categoryValue
      };
      if (formState.id_key) {
        await api.updateProduct(formState.id_key, payload);
      } else {
        await api.createProduct(payload);
      }
      setFormState(emptyForm);
      await loadProducts();
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
      const product = await api.getProduct(idKey);
      setFormState({
        id_key: product.id_key,
        name: product.name,
        price: String(product.price),
        stock: String(product.stock),
        category_id: String(product.category_id)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (idKey: number) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este producto?"
    );
    if (!confirmed) {
      return;
    }

    setFormLoading(true);
    setError(null);
    try {
      await api.deleteProduct(idKey);
      await loadProducts();
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
          <h1>Productos</h1>
          <p>Administra el catálogo de productos con operaciones CRUD.</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="content-grid">
        <div className="card">
          <h2>{isEditing ? "Editar producto" : "Crear producto"}</h2>
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
                placeholder="Nombre del producto"
                required
              />
            </label>
            <label className="field">
              <span>Precio</span>
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
                required
              />
            </label>
            <label className="field">
              <span>Stock</span>
              <input
                type="number"
                min="0"
                step="1"
                value={formState.stock}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    stock: event.target.value
                  }))
                }
                placeholder="0"
                required
              />
            </label>
            <label className="field">
              <span>Categoría (ID)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={formState.category_id}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    category_id: event.target.value
                  }))
                }
                placeholder="ID de categoría"
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
          {loading ? <p>Cargando productos...</p> : null}
          {!loading && products.length === 0 ? (
            <p className="empty">No hay productos cargados.</p>
          ) : null}
          {!loading && products.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id_key}>
                    <td>{product.id_key}</td>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>{product.category_id}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="link"
                        onClick={() => handleEdit(product.id_key)}
                        disabled={formLoading}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(product.id_key)}
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
