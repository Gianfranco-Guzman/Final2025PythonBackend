import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const SCROLL_TRIGGER_PX = 250;

export default function ScrollToTopButton() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  const isEnabledOnPage = useMemo(
    () => pathname === "/store" || pathname === "/store/products",
    [pathname],
  );

  useEffect(() => {
    if (!isEnabledOnPage) {
      setIsVisible(false);
      return;
    }

    const onScroll = () => {
      setIsVisible(window.scrollY > SCROLL_TRIGGER_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isEnabledOnPage]);

  if (!isEnabledOnPage || !isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      className="store-scroll-top"
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </button>
  );
}
