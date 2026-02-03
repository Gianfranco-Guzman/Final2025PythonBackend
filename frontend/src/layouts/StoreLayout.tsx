import { Outlet } from "react-router-dom";
import StoreHeader from "../components/store/StoreHeader";

export default function StoreLayout() {
  return (
    <div className="store-app">
      <StoreHeader />

      <main className="store-content">
        <Outlet />
      </main>
    </div>
  );
}
