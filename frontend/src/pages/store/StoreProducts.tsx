import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import { ApiCategory, ApiProduct } from "../../api/types";
import ProductCard from "../../components/store/ProductCard";
import { resolveCategoryImage } from "../../data/storeAssets";

type FetchStatus = "idle" | "loading" | "success" | "error";

type StoreFilters = {
  search: string;
  categoryId: number | null;
};

export default function StoreProducts() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categoryStatus, setCategoryStatus] = useState<FetchStatus>("idle");
  const [productStatus, setProductStatus] = useState<FetchStatus>("idle");
  const [filters, setFilters] = useState<StoreFilters>({ search: "", categoryId: null });
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
      } catch (error) {
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
    const search = searchParams.get("search") ?? "";
    const categoryParam = searchParams.get("category");
    const categoryId = categoryParam ? Number(categoryParam) : null;
    setFilters({ search, categoryId: Number.isNaN(categoryId) ? null : categoryId });
  }, [searchParams]);

  const categoryLookup = useMemo(() => {
    return new Map(categories.map((category) => [category.id_key, category]));
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return products.filter((product) => {
      if (filters.categoryId !== null && product.category_id !== filters.categoryId) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return product.name.toLowerCase().includes(normalizedSearch);
    });
  }, [filters.categoryId, filters.search, products]);

  const handleCategoryChange = (categoryId: number | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryId === null) {
      nextParams.delete("category");
    } else {
      nextParams.set("category", String(categoryId));
    }
    setSearchParams(nextParams, { replace: true });
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
          {categoryStatus === "success" && filters.categoryId !== null ? (
            <button
              type="button"
              className="store-chip store-chip-active"
              onClick={() => handleCategoryChange(null)}
            >
              {categoryLookup.get(filters.categoryId)?.name ?? "Categoría"} ×
            </button>
          ) : null}
          {filters.search ? (
            <button
              type="button"
              className="store-chip"
              onClick={() => {
                const nextParams = new URLSearchParams(searchParams);
                nextParams.delete("search");
                setSearchParams(nextParams, { replace: true });
              }}
            >
              {filters.search} ×
            </button>
          ) : null}
        </div>
      </div>

      {productStatus === "loading" ? (
        <p className="store-muted">Cargando productos...</p>
      ) : null}
      {productStatus === "error" ? (
        <p className="store-muted">
          No pudimos cargar los productos. Intenta nuevamente más tarde.
        </p>
      ) : null}
      {productStatus === "success" && filteredProducts.length === 0 ? (
        <p className="store-muted">
          No encontramos productos con los filtros seleccionados.
        </p>
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
