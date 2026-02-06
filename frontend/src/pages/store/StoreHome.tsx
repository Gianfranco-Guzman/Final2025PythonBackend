import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/client";
import { ApiCategory, ApiProduct } from "../../api/types";
import ProductCard from "../../components/store/ProductCard";
import { resolveCategoryImage } from "../../data/storeAssets";

type FetchStatus = "idle" | "loading" | "success" | "error";

export default function StoreHome() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setStatus("loading");
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
        setStatus("success");
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setStatus("error");
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryLookup = useMemo(() => {
    return new Map(categories.map((category) => [category.id_key, category.name]));
  }, [categories]);

  const featuredProducts = useMemo(() => {
    const lowStock = [...products]
      .filter((product) => product.stock <= 5)
      .sort((first, second) => first.stock - second.stock);

    const latest = [...products].sort((first, second) => second.id_key - first.id_key);

    const unique = new Map<number, ApiProduct>();
    [...lowStock, ...latest].forEach((product) => {
      unique.set(product.id_key, product);
    });

    return Array.from(unique.values()).slice(0, 6);
  }, [products]);

  const catalogProducts = useMemo(() => {
    const sortedByLatest = [...products].sort((first, second) => second.id_key - first.id_key);
    const selectedByCategory = new Map<number, ApiProduct[]>();

    sortedByLatest.forEach((product) => {
      const list = selectedByCategory.get(product.category_id) ?? [];
      if (list.length < 2) {
        selectedByCategory.set(product.category_id, [...list, product]);
      }
    });

    const mixed = Array.from(selectedByCategory.values()).flat();
    const mixedIds = new Set(mixed.map((product) => product.id_key));
    const remaining = sortedByLatest.filter((product) => !mixedIds.has(product.id_key));

    return [...mixed, ...remaining].slice(0, 8);
  }, [products]);

  const recommendedProducts = useMemo(() => {
    const byCategory = new Map<number, ApiProduct>();

    [...products]
      .sort((first, second) => first.price - second.price)
      .forEach((product) => {
        if (!byCategory.has(product.category_id)) {
          byCategory.set(product.category_id, product);
        }
      });

    return Array.from(byCategory.values()).slice(0, 6);
  }, [products]);

  return (
    <section className="store-home">
      <article className="store-hero">
        <div>
          <p className="store-pill">Tecnología para tu setup</p>
          <h2>Bienvenido a TECHSTORE</h2>
          <p className="store-subtitle">
            Explorá un catálogo completo de tecnología y encontrá el equipo ideal para tu
            próximo upgrade.
          </p>
        </div>
        <div className="store-highlight">
          <p>
            Catálogo activo con {products.length} productos para comparar y elegir con una
            experiencia de compra clara y directa.
          </p>
        </div>
      </article>

      {status === "loading" ? <p className="store-muted">Cargando contenido de la tienda...</p> : null}

      {status === "error" ? (
        <div className="store-card store-empty-state">
          <h3>No pudimos cargar el home</h3>
          <p>Revisa que el backend esté disponible para mostrar los productos reales.</p>
        </div>
      ) : null}

      {status === "success" ? (
        <>
          <section className="store-products store-home-section">
            <div className="store-products-header">
              <div>
                <h2>Destacados</h2>
                <p className="store-muted">Productos con menor stock y últimas altas del catálogo.</p>
              </div>
            </div>
            <div className="store-products-grid">
              {featuredProducts.map((product) => {
                const categoryName = categoryLookup.get(product.category_id) ?? "Sin categoría";

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
          </section>

          <section className="store-products store-home-section">
            <div className="store-products-header">
              <div>
                <h2>Últimos ingresos</h2>
                <p className="store-muted">Selección mixta por categorías con novedades para descubrir.</p>
              </div>
            </div>
            <div className="store-products-grid">
              {catalogProducts.map((product) => {
                const categoryName = categoryLookup.get(product.category_id) ?? "Sin categoría";

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
          </section>

          <section className="store-card store-home-recommendations">
            <div>
              <p className="store-pill">Recomendados</p>
              <h3>Selección recomendada</h3>
            </div>
            <div className="store-products-grid">
              {recommendedProducts.length > 0 ? (
                recommendedProducts.map((product) => {
                  const categoryName = categoryLookup.get(product.category_id) ?? "Sin categoría";

                  return (
                    <ProductCard
                      key={product.id_key}
                      product={product}
                      categoryName={categoryName}
                      imageSrc={resolveCategoryImage(categoryName)}
                    />
                  );
                })
              ) : (
                <p className="store-muted">Aún no hay productos disponibles para recomendar.</p>
              )}
            </div>
          </section>
        </>
      ) : null}
    </section>
  );
}
