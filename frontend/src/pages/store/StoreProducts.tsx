import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api/client";
import { ApiCategory, ApiProduct } from "../../api/types";
import ProductCard from "../../components/store/ProductCard";
import { resolveCategoryImage } from "../../data/storeAssets";

type FetchStatus = "idle" | "loading" | "success" | "error";

type StoreFilters = {
  search: string;
  categoryIds: number[];
};

export default function StoreProducts() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categoryStatus, setCategoryStatus] = useState<FetchStatus>("idle");
  const [productStatus, setProductStatus] = useState<FetchStatus>("idle");
  const [filters, setFilters] = useState<StoreFilters>({ search: "", categoryIds: [] });
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
    const categoryParam = searchParams.get("category") ?? "";
    const categoryIds = categoryParam
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value));
    setFilters({ search, categoryIds: Array.from(new Set(categoryIds)) });
  }, [searchParams]);

  const categoryLookup = useMemo(() => {
    return new Map(categories.map((category) => [category.id_key, category]));
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return products.filter((product) => {
      if (
        filters.categoryIds.length > 0 &&
        !filters.categoryIds.includes(product.category_id)
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return product.name.toLowerCase().includes(normalizedSearch);
    });
  }, [filters.categoryIds, filters.search, products]);

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
          {categoryStatus === "success"
            ? filters.categoryIds.map((categoryId) => (
                <span key={categoryId} className="store-chip store-chip-active">
                  {categoryLookup.get(categoryId)?.name ?? "Categoría"}
                </span>
              ))
            : null}
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
          {filters.categoryIds.length > 0 || filters.search ? (
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
