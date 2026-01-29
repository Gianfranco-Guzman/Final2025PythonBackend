import { useEffect, useState } from "react";
import { api } from "../api/client";
import { ApiCategory, ApiHealthCheck, ApiProduct } from "../api/types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD"
  }).format(value);

const initialStatus: ApiHealthCheck = { status: "loading" };

export default function Dashboard() {
  const [health, setHealth] = useState<ApiHealthCheck>(initialStatus);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [healthResponse, categoryResponse, productResponse] =
          await Promise.all([
            api.getHealthCheck(),
            api.getCategories(),
            api.getProducts()
          ]);
        setHealth(healthResponse);
        setCategories(categoryResponse);
        setProducts(productResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      }
    };

    load();
  }, []);

  return (
    <div className="dashboard">
      <header className="hero">
        <div>
          <p className="overline">E-commerce API</p>
          <h1>Panel inicial para consumir la API</h1>
          <p className="subtitle">
            Este dashboard valida la conexión con el backend, lista categorías y
            productos usando los endpoints existentes.
          </p>
        </div>
        <div className="status">
          <span>Estado API</span>
          <strong>{health.status}</strong>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="grid">
        <div className="card">
          <h2>Categorías</h2>
          <p className="count">{categories.length}</p>
          <ul>
            {categories.map((category) => (
              <li key={category.id_key}>{category.name}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2>Productos</h2>
          <p className="count">{products.length}</p>
          <ul>
            {products.map((product) => (
              <li key={product.id_key}>
                <div>
                  <span className="product-name">{product.name}</span>
                  <span className="product-meta">
                    Stock: {product.stock} · Cat: {product.category_id}
                  </span>
                </div>
                <span className="product-price">
                  {formatCurrency(product.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
