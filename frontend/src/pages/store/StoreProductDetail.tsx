import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/client";
import { ApiProduct } from "../../api/types";
import { resolveCategoryImage } from "../../data/storeAssets";
import { getStoredUser } from "../../store/accountStorage";
import { useCart } from "../../store/cartStore";
import { formatPrice } from "../../utils/formatters";

type FetchStatus = "idle" | "loading" | "success" | "error";

export default function StoreProductDetail() {
  const { addItem, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const productId = Number(id);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [categoryName, setCategoryName] = useState("Sin categoría");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!productId || Number.isNaN(productId)) {
        setStatus("error");
        return;
      }

      setStatus("loading");
      try {
        const response = await api.getProduct(productId);
        if (!isMounted) {
          return;
        }
        setProduct(response);
        setStatus("success");

        try {
          const categoryResponse = await api.getCategory(response.category_id);
          if (!isMounted) {
            return;
          }
          setCategoryName(categoryResponse.name);
        } catch {
          if (!isMounted) {
            return;
          }
          setCategoryName("Sin categoría");
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setStatus("error");
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const isLowStock = product ? product.stock <= 5 : false;
  const imageSrc = useMemo(() => {
    if (!product) {
      return "";
    }

    return resolveCategoryImage(categoryName);
  }, [categoryName, product]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    const user = getStoredUser();
    if (!user) {
      navigate(`${location.pathname}${location.search}`, {
        state: { openLogin: true }
      });
      return;
    }

    addItem(product, categoryName, imageSrc);
    openCart();
  };

  return (
    <section className="store-detail">
      <Link className="store-link" to="/store/products">
        ← Volver al catálogo
      </Link>

      {status === "loading" ? (
        <p className="store-muted">Cargando detalle del producto...</p>
      ) : null}
      {status === "error" ? (
        <div className="store-card">
          <h3>No pudimos cargar este producto.</h3>
          <p>Intenta nuevamente o vuelve al listado de productos.</p>
          <Link className="store-ghost" to="/store/products">
            Volver al catálogo
          </Link>
        </div>
      ) : null}

      {status === "success" && product ? (
        <div className="store-detail-card">
          <div className="store-detail-media">
            <img src={imageSrc} alt={product.name} />
          </div>
          <div className="store-detail-content">
            <p className="store-pill">{categoryName}</p>
            <h2>{product.name}</h2>
            <p className="store-detail-price">{formatPrice(product.price)}</p>
            <p className={isLowStock ? "store-stock store-stock-warning" : "store-stock"}>
              {isLowStock
                ? `Últimas ${product.stock} unidades disponibles`
                : `${product.stock} unidades disponibles`}
            </p>
            <div className="store-detail-meta">
              <div>
                <span>SKU</span>
                <strong>#{product.id_key}</strong>
              </div>
              <div>
                <span>Categoría</span>
                <strong>{categoryName}</strong>
              </div>
              <div>
                <span>Estado</span>
                <strong>{product.stock > 0 ? "En stock" : "Sin stock"}</strong>
              </div>
            </div>
            <div className="store-detail-actions">
              <button
                type="button"
                className="store-button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                Agregar al carrito
              </button>
              <Link className="store-ghost" to="/store/products">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
