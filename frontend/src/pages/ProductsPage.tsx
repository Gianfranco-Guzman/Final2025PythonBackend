import { useEffect, useState } from "react";
import { api } from "../api/client";
import { ApiProduct } from "../api/types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD"
  }).format(value);

export default function ProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
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

    load();
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Productos</h1>
          <p>Listado simple de productos disponibles en la API.</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <div className="card">
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}
