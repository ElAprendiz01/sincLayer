import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Verificamos si existe el token en el localStorage
  const token = localStorage.getItem("token");

  // Si no hay token, lo redirigimos a la raíz (tu Login) y reemplazamos el historial
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si sí hay token, lo dejamos pasar al componente que intentaba ver
  return children;
}