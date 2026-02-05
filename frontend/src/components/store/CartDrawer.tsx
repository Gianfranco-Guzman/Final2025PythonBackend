import { Link } from "react-router-dom";
import { useCart } from "../../store/cartStore";
import { formatPrice } from "../../utils/formatters";

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalPrice, closeCart, removeItem, updateQuantity } =
    useCart();

  return (
    <div className={`store-cart ${isOpen ? "store-cart-open" : ""}`}>
      <div className="store-cart-panel" role="dialog" aria-modal="true" aria-label="Carrito">
        <div className="store-cart-header">
          <div>
            <p className="store-pill">Carrito</p>
            <h2>Tu compra</h2>
            <p className="store-muted">
              {totalItems > 0
                ? `${totalItems} artículo${totalItems === 1 ? "" : "s"} en el carrito`
                : "Aún no agregas productos."}
            </p>
          </div>
          <button type="button" className="store-modal-close" onClick={closeCart} aria-label="Cerrar">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="store-card store-empty-state">
            <h3>Tu carrito está vacío</h3>
            <p>Explora los productos para sumar tu primera selección.</p>
            <Link className="store-button" to="/store/products" onClick={closeCart}>
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="store-cart-body">
            <ul className="store-cart-items">
              {items.map((item) => (
                <li key={item.id} className="store-cart-item">
                  <div className="store-cart-thumb">
                    <img src={item.imageSrc} alt={item.name} />
                  </div>
                  <div className="store-cart-info">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="store-muted">{item.categoryName}</p>
                    </div>
                    <p className="store-cart-price">{formatPrice(item.price)}</p>
                    <div className="store-cart-actions">
                      <button
                        type="button"
                        className="store-ghost"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="store-ghost"
                        onClick={() => updateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="store-cart-remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="store-cart-footer">
              <div>
                <p className="store-muted">Total</p>
                <p className="store-cart-total">{formatPrice(totalPrice)}</p>
                <p className="store-feedback">Checkout demo, sin cobro real.</p>
              </div>
              <button type="button" className="store-button">
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        className="store-cart-backdrop"
        aria-label="Cerrar carrito"
        onClick={closeCart}
      />
    </div>
  );
}
