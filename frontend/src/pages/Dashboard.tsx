import { useEffect, useState } from "react";
import { api } from "../api/client";
import { ApiCategory, ApiHealthCheck, ApiProduct } from "../api/types";
import { seedAdminDemoData } from "../store/adminDemoSeed";

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
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [seeding, setSeeding] = useState<boolean>(false);

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

  const handleSeedData = async () => {
    setSeeding(true);
    setError(null);
    setSeedResult(null);
    try {
      const result = await seedAdminDemoData();
      setSeedResult(
        `Carga lista: +${result.clients} clientes, +${result.addresses} direcciones, +${result.bills} facturas, +${result.orders} órdenes, +${result.orderDetails} detalles, +${result.reviews} reseñas.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="hero">
        <div>
          <p className="overline">E-commerce API</p>
          <h1>Panel inicial de gestión</h1>
          <p className="subtitle">
            Administra los datos de la tienda y mantén el catálogo actualizado.
          </p>
          <div className="seed-actions">
            <button type="button" onClick={handleSeedData} disabled={seeding}>
              {seeding
                ? "Preparando datos iniciales..."
                : "Cargar datos iniciales"}
            </button>
            {seedResult ? <p className="seed-result">{seedResult}</p> : null}
          </div>
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
