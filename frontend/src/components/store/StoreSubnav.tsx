import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../../api/client";
import { ApiCategory } from "../../api/types";

type CategoryLink = {
  id: number;
  name: string;
};

export default function StoreSubnav() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const response = await api.getCategories();
        if (isMounted) {
          setCategories(response);
        }
      } catch {
        if (isMounted) {
          setCategories([]);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryLinks = useMemo<CategoryLink[]>(
    () =>
      categories.map((category) => ({
        id: category.id_key,
        name: category.name,
      })),
    [categories]
  );

  const buildProductUrl = (params: { category?: string | null }) => {
    const nextParams = new URLSearchParams();
    if (params.category) {
      nextParams.set("category", params.category);
    }
    const query = nextParams.toString();
    return `/store/products${query ? `?${query}` : ""}`;
  };

  return (
    <div className="store-subnav">
      <NavLink className="store-subnav-link" to="/store/products">
        Productos
      </NavLink>
      <div className="store-subnav-dropdown">
        <span className="store-subnav-trigger">Categorías</span>
        <div className="store-subnav-menu">
          <NavLink className="store-subnav-item" to="/store/products">
            Todas
          </NavLink>
          {categoryLinks.map((category) => (
            <NavLink
              key={category.id}
              className="store-subnav-item"
              to={buildProductUrl({ category: String(category.id) })}
            >
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
