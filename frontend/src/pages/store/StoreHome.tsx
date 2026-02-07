import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
      } catch {
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

  const featuredCategories = useMemo(() => {
    return [...categories].sort((first, second) => first.id_key - second.id_key).slice(0, 5);
  }, [categories]);

  const featuredProducts = useMemo(() => {
    return [...products].sort((first, second) => second.id_key - first.id_key).slice(0, 8);
  }, [products]);

  return (
    <section className="store-home">
      <article className="store-hero">
        <div>
          <p className="store-pill">Tecnología para tu día a día</p>
          <h2>Todo tu setup en un solo lugar</h2>
          <p className="store-subtitle">
            Descubrí productos de informática, gaming y accesorios con entrega rápida y
            compra 100% online.
          </p>
          <Link className="store-button" to="/store/products">
            Ver catálogo
          </Link>
        </div>
        <div className="store-highlight">
          <p>Más de {products.length} productos listos para comparar y sumar a tu carrito.</p>
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
          <section className="store-card store-home-categories">
            <div className="store-products-header">
              <div>
                <h2>Categorías destacadas</h2>
                <p className="store-muted">Elegí una categoría y encontrá tus próximos favoritos.</p>
              </div>
            </div>
            <div className="store-home-categories-grid">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id_key}
                  className="store-home-category-card"
                  to={`/store/products?category=${category.id_key}`}
                >
                  <img src={resolveCategoryImage(category.name)} alt={category.name} loading="lazy" />
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="store-products store-home-section">
            <div className="store-products-header">
              <div>
                <h2>Productos destacados</h2>
                <p className="store-muted">Novedades reales del catálogo para comprar hoy.</p>
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

          <section className="store-card store-home-benefits">
            <div className="store-products-header">
              <div>
                <h2>¿Por qué comprar en TECHSTORE?</h2>
              </div>
            </div>
            <div className="store-home-benefits-grid">
              <article className="store-home-mini-card">
                <h4>Compra segura</h4>
                <p>Proceso de checkout simple y protegido para comprar con tranquilidad.</p>
              </article>
              <article className="store-home-mini-card">
                <h4>Envíos rápidos</h4>
                <p>Despachamos tu pedido para que recibas tu tecnología sin demoras.</p>
              </article>
              <article className="store-home-mini-card">
                <h4>Soporte dedicado</h4>
                <p>Te acompañamos antes y después de la compra para que elijas mejor.</p>
              </article>
            </div>
          </section>
        </>
      ) : null}
    </section>
  );
}
