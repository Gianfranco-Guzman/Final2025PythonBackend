import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import { ApiCategory } from "../../api/types";

type FetchStatus = "idle" | "loading" | "success" | "error";

export default function StoreCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [searchParams, setSearchParams] = useSearchParams();

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
      } catch {
        if (!isMounted) {
          return;
        }
        setCategories([]);
        setStatus("error");
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCategoryIds = useMemo(() => {
    const raw = searchParams.get("category") ?? "";
    return raw
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value));
  }, [searchParams]);

  const updateCategoryFilter = (categoryIds: number[]) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryIds.length === 0) {
      nextParams.delete("category");
    } else {
      nextParams.set("category", categoryIds.join(","));
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleAllToggle = () => {
    updateCategoryFilter([]);
  };

  const handleCategoryToggle = (categoryId: number) => {
    const nextCategories = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];

    updateCategoryFilter(nextCategories);
  };

  const productsUrl = `/store/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return (
    <section className="store-products">
      <div className="store-products-header">
        <div>
          <h2>Categorías</h2>
          <p className="store-muted">Selecciona una o varias categorías para filtrar productos.</p>
        </div>
      </div>

      {status === "loading" ? <p className="store-muted">Cargando categorías...</p> : null}

      {status === "error" ? (
        <div className="store-card store-empty-state">
          <h3>No pudimos cargar las categorías</h3>
          <p>Intenta nuevamente más tarde o recarga la página.</p>
        </div>
      ) : null}

      {status === "success" ? (
        <div className="store-card">
          <div className="store-products-filters">
            <label
              className={
                selectedCategoryIds.length === 0
                  ? "store-chip store-chip-active"
                  : "store-chip"
              }
            >
              <input
                type="checkbox"
                checked={selectedCategoryIds.length === 0}
                onChange={handleAllToggle}
              />
              Todas
            </label>

            {categories.map((category) => {
              const isSelected = selectedCategoryIds.includes(category.id_key);

              return (
                <label
                  key={category.id_key}
                  className={isSelected ? "store-chip store-chip-active" : "store-chip"}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(category.id_key)}
                  />
                  {category.name}
                </label>
              );
            })}
          </div>

          <div className="store-detail-actions">
            <Link className="store-button" to={productsUrl}>
              Ver productos filtrados
            </Link>
            <button type="button" className="store-ghost" onClick={handleAllToggle}>
              Limpiar selección
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
