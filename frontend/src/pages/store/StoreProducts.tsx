import { useEffect, useMemo, useState, type ChangeEvent } from "react";
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

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setFilters((prev) => ({ ...prev, categoryId }));
  };

  return (
    <section className="store-grid">
      <section className="store-categories">
        <div className="store-categories-header">
          <div>
            <h2>Explora por categoría</h2>
            <p>Filtra el catálogo usando las categorías reales del backend.</p>
          </div>
          <label className="store-search">
            <span>Búsqueda</span>
            <input
              type="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Busca un producto"
            />
          </label>
        </div>
        {categoryStatus === "loading" ? (
          <p className="store-muted">Cargando categorías...</p>
        ) : null}
        {categoryStatus === "error" ? (
          <p className="store-muted">
            No pudimos cargar las categorías. Intenta nuevamente más tarde.
          </p>
        ) : null}
        {categoryStatus === "success" && categories.length === 0 ? (
          <p className="store-muted">Aún no hay categorías disponibles.</p>
        ) : null}
        {categories.length > 0 ? (
          <div className="store-category-nav" role="tablist" aria-label="Categorías">
            <button
              type="button"
              className={
                filters.categoryId === null
                  ? "store-chip store-chip-active"
                  : "store-chip"
              }
              onClick={() => handleCategoryChange(null)}
              aria-pressed={filters.categoryId === null}
            >
              Todas
            </button>
            {categories.map((category) => (
              <button
                key={category.id_key}
                type="button"
                className={
                  filters.categoryId === category.id_key
                    ? "store-chip store-chip-active"
                    : "store-chip"
                }
                onClick={() => handleCategoryChange(category.id_key)}
                aria-pressed={filters.categoryId === category.id_key}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="store-products">
        <div className="store-products-header">
          <div>
            <h2>Productos destacados</h2>
            <p className="store-muted">
              {productStatus === "success"
                ? `${filteredProducts.length} productos encontrados`
                : "Cargando productos del backend"}
            </p>
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
    </section>
  );
}
