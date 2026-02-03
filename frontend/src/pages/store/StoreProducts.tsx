import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { ApiCategory } from "../../api/types";

const demoSections = [
  {
    title: "Catálogo real en la próxima fase",
    description:
      "Aquí vivirá el grid de productos con filtros por categoría y búsqueda.",
  },
  {
    title: "Layout listo para crecer",
    description:
      "El layout de tienda ya es independiente del admin y soporta rutas /store/*.",
  },
];

type FetchStatus = "idle" | "loading" | "success" | "error";

export default function StoreProducts() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setStatus("loading");
      try {
        const response = await api.getCategories();
        if (!isMounted) {
          return;
        }
        setCategories(response);
        setStatus("success");
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setStatus("error");
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="store-grid">
      <section className="store-categories">
        <div className="store-categories-header">
          <h2>Explora por categoría</h2>
          <p>Filtra el catálogo usando las categorías reales del backend.</p>
        </div>
        {status === "loading" ? (
          <p className="store-muted">Cargando categorías...</p>
        ) : null}
        {status === "error" ? (
          <p className="store-muted">
            No pudimos cargar las categorías. Intenta nuevamente más tarde.
          </p>
        ) : null}
        {status === "success" && categories.length === 0 ? (
          <p className="store-muted">Aún no hay categorías disponibles.</p>
        ) : null}
        {categories.length > 0 ? (
          <div className="store-category-nav" role="tablist" aria-label="Categorías">
            <button
              type="button"
              className={
                selectedCategoryId === null
                  ? "store-chip store-chip-active"
                  : "store-chip"
              }
              onClick={() => setSelectedCategoryId(null)}
              aria-pressed={selectedCategoryId === null}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category.id_key}
                type="button"
                className={
                  selectedCategoryId === category.id_key
                    ? "store-chip store-chip-active"
                    : "store-chip"
                }
                onClick={() => setSelectedCategoryId(category.id_key)}
                aria-pressed={selectedCategoryId === category.id_key}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      {demoSections.map((section) => (
        <article className="store-card" key={section.title}>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
        </article>
      ))}
    </section>
  );
}
