import { NavLink } from "react-router-dom";

export default function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="store-footer-content">
        <div>
          <p className="store-footer-brand">TECHSTORE</p>
          <p className="store-footer-text">
            Hardware premium y asesoría para potenciar tu setup gamer y profesional.
          </p>
        </div>
        <div>
          <p className="store-footer-title">Explorar</p>
          <div className="store-footer-links">
            <NavLink to="/store">Inicio</NavLink>
            <NavLink to="/store/products">Productos</NavLink>
            <NavLink to="/store/account">Mi cuenta</NavLink>
          </div>
        </div>
        <div>
          <p className="store-footer-title">Contacto</p>
          <p className="store-footer-text">ventas@techstore.com</p>
          <p className="store-footer-text">+54 11 5555-1234</p>
          <p className="store-footer-text">Lun a Vie · 9:00 - 19:00</p>
        </div>
      </div>
      <div className="store-footer-bottom">
        <p className="store-footer-text">© 2025 TechStore. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
