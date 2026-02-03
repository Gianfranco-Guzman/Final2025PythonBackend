import { Navigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

const STORAGE_ADMIN_KEY = "isAdmin";

export default function AdminGate() {
  const isAdmin = localStorage.getItem(STORAGE_ADMIN_KEY) === "true";

  if (!isAdmin) {
    return <Navigate to="/store" replace />;
  }

  return <AdminLayout />;
}
