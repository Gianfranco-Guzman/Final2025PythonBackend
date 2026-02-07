import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { ApiCategory, ApiProduct } from "../../api/types";
import ProductCard from "../../components/store/ProductCard";
import { DemoCategoryKey, categoryImageMap } from "../../data/demoCatalog";
import { resolveCategoryImage } from "../../data/storeAssets";

type FetchStatus = "idle" | "loading" | "success" | "error";

const carouselCategoryOrder: DemoCategoryKey[] = [
  "auricular",
  "mouse",
  "teclado",
  "placa de video",
  "procesador"
];

const resolveCategoryKey = (categoryName: string): DemoCategoryKey | null => {
  const normalized = categoryName.trim().toLowerCase();

  if (normalized.includes("placa")) {
    return "placa de video";
  }
  if (normalized.includes("proces")) {
    return "procesador";
  }
  if (normalized.includes("auricular") || normalized.includes("head")) {
    return "auricular";
  }
  if (normalized.includes("mouse")) {
    return "mouse";
  }
  if (normalized.includes("tecl")) {
    return "teclado";
  }

  return null;
};

export default function StoreHome() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [activeSlide, setActiveSlide] = useState(0);

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

  const categoryKeyById = useMemo(() => {
    return new Map(
      categories
        .map((category) => {
          const key = resolveCategoryKey(category.name);
          return key ? ([category.id_key, key] as const) : null;
        })
        .filter((entry): entry is readonly [number, DemoCategoryKey] => entry !== null)
    );
  }, [categories]);

  const featuredCategories = useMemo(() => {
    return [...categories].sort((first, second) => first.id_key - second.id_key).slice(0, 5);
  }, [categories]);

  const featuredProducts = useMemo(() => {
    return [...products].sort((first, second) => second.id_key - first.id_key).slice(0, 8);
  }, [products]);

  const carouselProducts = useMemo(() => {
    const sortedProducts = [...products].sort((first, second) => second.id_key - first.id_key);
    const selected: ApiProduct[] = [];
    const selectedIds = new Set<number>();

    carouselCategoryOrder.forEach((categoryKey) => {
      const match = sortedProducts.find(
        (product) =>
          !selectedIds.has(product.id_key) && categoryKeyById.get(product.category_id) === categoryKey
      );

      if (!match) {
        return;
      }

      selected.push(match);
      selectedIds.add(match.id_key);
    });

    sortedProducts.forEach((product) => {
      if (selected.length >= carouselCategoryOrder.length || selectedIds.has(product.id_key)) {
        return;
      }

      selected.push(product);
      selectedIds.add(product.id_key);
    });

    return selected;
  }, [products, categoryKeyById]);

  useEffect(() => {
    if (carouselProducts.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselProducts.length);
    }, 4500);

    return () => {
      window.clearInterval(timer);
    };
  }, [carouselProducts]);

  useEffect(() => {
    if (activeSlide >= carouselProducts.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, carouselProducts]);

  const handlePrevSlide = () => {
    setActiveSlide((current) => (current === 0 ? carouselProducts.length - 1 : current - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((current) => (current + 1) % carouselProducts.length);
  };

  return (
    <section className="store-home">
      {status === "loading" ? <p className="store-muted">Cargando contenido de la tienda...</p> : null}

      {status === "error" ? (
        <div className="store-card store-empty-state">
          <h3>No pudimos cargar el home</h3>
          <p>Revisa que el backend esté disponible para mostrar los productos reales.</p>
        </div>
      ) : null}

      {status === "success" ? (
        <>
          {carouselProducts.length > 0 ? (
            <section className="store-hero-carousel" aria-label="Productos destacados en carrusel">
              <div
                className="store-hero-carousel-track"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {carouselProducts.map((product) => {
                  const categoryName = categoryLookup.get(product.category_id) ?? "Sin categoría";
                  const categoryKey = resolveCategoryKey(categoryName);
                  const imageSrc = categoryKey
                    ? categoryImageMap[categoryKey]
                    : categoryImageMap["placa de video"];

                  return (
                    <Link
                      key={product.id_key}
                      className="store-hero-slide"
                      to={`/store/products/${product.id_key}`}
                    >
                      <img src={imageSrc} alt={product.name} loading="lazy" />
                      <div className="store-hero-slide-overlay">
                        <span className="store-hero-category-badge">{categoryName}</span>
                        <div className="store-hero-slide-copy">
                          <h2>{product.name}</h2>
                          <p className="store-subtitle">Ver detalle del producto</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {carouselProducts.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="store-carousel-control store-carousel-control-prev"
                    onClick={handlePrevSlide}
                    aria-label="Slide anterior"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="store-carousel-control store-carousel-control-next"
                    onClick={handleNextSlide}
                    aria-label="Siguiente slide"
                  >
                    ›
                  </button>
                  <div className="store-carousel-dots" role="tablist" aria-label="Seleccionar slide">
                    {carouselProducts.map((product, index) => (
                      <button
                        key={product.id_key}
                        type="button"
                        className={
                          index === activeSlide
                            ? "store-carousel-dot store-carousel-dot-active"
                            : "store-carousel-dot"
                        }
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Ir al slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          ) : null}

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
