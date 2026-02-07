import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import { ApiCategory, ApiProduct } from "../../api/types";
import ProductCard from "../../components/store/ProductCard";
import { resolveCategoryImage } from "../../data/storeAssets";

type FetchStatus = "idle" | "loading" | "success" | "error";

type StoreFilters = {
  query: string;
  categoryIds: number[];
};

export default function StoreProducts() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categoryStatus, setCategoryStatus] = useState<FetchStatus>("idle");
  const [productStatus, setProductStatus] = useState<FetchStatus>("idle");
  const [filters, setFilters] = useState<StoreFilters>({ query: "", categoryIds: [] });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setCategoryStatus("loading");
      setProductStatus("loading");
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          api.getCategories(),
          api.getProducts()
        ]);
        if (!isMounted) {
          return;
        }
        setCategories(categoryResponse);
        setProducts(productResponse);
        setCategoryStatus("success");
        setProductStatus("success");
      } catch {
        if (!isMounted) {
          return;
        }
        setCategoryStatus("error");
        setProductStatus("error");
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const query = searchParams.get("q") ?? searchParams.get("search") ?? "";
    const categoryParam = searchParams.get("category") ?? "";
    const categoryIds = categoryParam
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value));

    setFilters({ query, categoryIds: Array.from(new Set(categoryIds)) });
  }, [searchParams]);

  const categoryLookup = useMemo(() => {
    return new Map(categories.map((category) => [category.id_key, category]));
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return products.filter((product) => {
      if (
        filters.categoryIds.length > 0 &&
        !filters.categoryIds.includes(product.category_id)
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const categoryName = categoryLookup.get(product.category_id)?.name?.toLowerCase() ?? "";

      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        categoryName.includes(normalizedQuery)
      );
    });
  }, [categoryLookup, filters.categoryIds, filters.query, products]);

  const handleCategoryToggle = (categoryId: number) => {
    const nextParams = new URLSearchParams(searchParams);
    const nextCategories = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter((id) => id !== categoryId)
      : [...filters.categoryIds, categoryId];

    if (nextCategories.length === 0) {
      nextParams.delete("category");
    } else {
      nextParams.set("category", nextCategories.join(","));
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <section className="store-products">
      <div className="store-products-header">
        <div>
          <h2>Productos</h2>
          <p className="store-muted">
            {productStatus === "success"
              ? `${filteredProducts.length} productos encontrados`
              : "Cargando productos del backend"}
          </p>
        </div>

        <div className="store-products-filters">
          {categoryStatus === "success" ? (
            <>
              {categories.map((category) => {
                const isSelected = filters.categoryIds.includes(category.id_key);

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
            </>
          ) : null}

          {filters.query ? (
            <button
              type="button"
              className="store-chip"
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.delete("q");
                nextParams.delete("search");
                setSearchParams(nextParams, { replace: true });
              }}
            >
              {filters.query} ×
            </button>
          ) : null}

          {filters.categoryIds.length > 0 || filters.query ? (
            <button type="button" className="store-ghost" onClick={handleClearFilters}>
              Limpiar filtros
            </button>
          ) : null}
        </div>
      </div>

      {productStatus === "loading" ? (
        <p className="store-muted">Cargando productos...</p>
      ) : null}
      {productStatus === "error" ? (
        <div className="store-card store-empty-state">
          <h3>No pudimos cargar los productos</h3>
          <p>Intenta nuevamente más tarde o recarga la página.</p>
        </div>
      ) : null}
      {productStatus === "success" && filteredProducts.length === 0 ? (
        <div className="store-card store-empty-state">
          <h3>No encontramos productos</h3>
          <p>Prueba con otra búsqueda o limpia los filtros para ver todo el catálogo.</p>
          <button type="button" className="store-ghost" onClick={handleClearFilters}>
            Limpiar filtros
          </button>
        </div>
      ) : null}

      {filteredProducts.length > 0 ? (
        <div className="store-products-grid">
          {filteredProducts.map((product) => {
            const category = categoryLookup.get(product.category_id);
            const categoryName = category?.name ?? "Sin categoría";

            return (
              <ProductCard
                key={product.id_key}
                product={product}
                categoryName={categoryName}
                imageSrc={resolveCategoryImage(categoryName)}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
