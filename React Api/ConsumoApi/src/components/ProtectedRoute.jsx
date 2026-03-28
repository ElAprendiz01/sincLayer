import { Navigate, Outlet } from "react-router-dom"; // 1. Importamos Outlet

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Si tiene 'children' (método 1), los muestra. 
  // Si no (método 2), muestra el 'Outlet'.
  return children ? children : <Outlet />;
}