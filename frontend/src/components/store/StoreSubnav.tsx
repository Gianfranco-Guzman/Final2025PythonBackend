import { NavLink } from "react-router-dom";

export default function StoreSubnav() {
  return (
    <div className="store-subnav">
      <NavLink className="store-subnav-link" to="/store/products">
        Productos
      </NavLink>
      <NavLink className="store-subnav-link" to="/store/products">
        Categorías
      </NavLink>
    </div>
  );
}
