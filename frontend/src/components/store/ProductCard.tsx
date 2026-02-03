import { ApiProduct } from "../../api/types";

type ProductCardProps = {
  product: ApiProduct;
  categoryName: string;
  imageSrc: string;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(price);

export default function ProductCard({
  product,
  categoryName,
  imageSrc
}: ProductCardProps) {
  const isLowStock = product.stock <= 5;

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
      </div>
    </article>
  );
}
