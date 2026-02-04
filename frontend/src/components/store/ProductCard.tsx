import { Link } from "react-router-dom";
import { ApiProduct } from "../../api/types";
import { useCart } from "../../store/cartStore";
import { formatPrice } from "../../utils/formatters";

type ProductCardProps = {
  product: ApiProduct;
  categoryName: string;
  imageSrc: string;
};

export default function ProductCard({
  product,
  categoryName,
  imageSrc
}: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const isLowStock = product.stock <= 5;

  const handleAddToCart = () => {
    addItem(product, categoryName, imageSrc);
    openCart();
  };

  return (
    <article className="store-product-card">
      <div className="store-product-media">
        <img src={imageSrc} alt={product.name} loading="lazy" />
        <span className="store-product-badge">{categoryName}</span>
      </div>
      <div className="store-product-body">
        <div>
          <h3>{product.name}</h3>
          <p className="store-product-price">{formatPrice(product.price)}</p>
        </div>
        <p className={isLowStock ? "store-stock store-stock-warning" : "store-stock"}>
          {isLowStock
            ? `Últimas ${product.stock} unidades disponibles`
            : `${product.stock} unidades disponibles`}
        </p>
        <div className="store-product-actions">
          <Link className="store-ghost" to={`/store/products/${product.id_key}`}>
            Ver detalle
          </Link>
          <button type="button" className="store-button" onClick={handleAddToCart}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
