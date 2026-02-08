import { NavLink } from "react-router-dom";

export default function StoreSubnav() {
  return (
    <div className="store-subnav">
      <NavLink className="store-subnav-link" to="/store" end>
        Inicio
      </NavLink>
      <NavLink className="store-subnav-link" to="/store/products" end>
        Catálogo
      </NavLink>
    </div>
  );
}
