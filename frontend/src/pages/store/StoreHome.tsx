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
    return [...products].sort((first, second) => second.id_key - first.id_key).slice(0, 8);
  }, [products]);

  const recommendedProducts = useMemo(() => {
    const featuredIds = new Set(featuredProducts.map((product) => product.id_key));

    return [...products]
      .filter((product) => !featuredIds.has(product.id_key))
      .sort((first, second) => second.stock - first.stock)
      .slice(0, 3);
  }, [featuredProducts, products]);

  return (
    <section className="store-home">
      <article className="store-hero">
        <div>
          <p className="store-pill">Tecnología para tu setup</p>
          <h2>Bienvenido a TECHSTORE</h2>
          <p className="store-subtitle">
            Explorá productos reales cargados desde el backend y encontrá ofertas para tu
            próximo upgrade.
          </p>
        </div>
        <div className="store-highlight">
          <p>
            Catálogo activo con {products.length} productos. Descubrí novedades, bajo stock y
            recomendados en una sola vista.
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
                <h2>Productos para explorar</h2>
                <p className="store-muted">Selección de 8 productos reales listos para agregar al carrito.</p>
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
              <p className="store-pill">Novedades / Recomendados</p>
              <h3>Lo más recomendado por disponibilidad</h3>
            </div>
            <div className="store-home-recommendations-list">
              {recommendedProducts.length > 0 ? (
                recommendedProducts.map((product) => (
                  <article key={product.id_key} className="store-home-mini-card">
                    <h4>{product.name}</h4>
                    <p>
                      {categoryLookup.get(product.category_id) ?? "Sin categoría"} · Stock: {product.stock}
                    </p>
                  </article>
                ))
              ) : (
                <p className="store-muted">Suma más productos para generar recomendaciones automáticas.</p>
              )}
            </div>
          </section>
        </>
      ) : null}
    </section>
  );
}
