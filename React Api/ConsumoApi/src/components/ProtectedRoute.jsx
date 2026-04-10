import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  // 1. Obtener Token y Rol
  const token = localStorage.getItem("token");
  const rawRole = localStorage.getItem("userRole");
  
  // 2. Normalizar el rol actual
  const userRole = rawRole ? rawRole.trim().toLowerCase() : null;

  // 3. Verificar si está logueado
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 4. Si la ruta requiere roles específicos, verificar permiso
  if (allowedRoles.length > 0) {
    // Convertimos todos los roles permitidos a minúsculas para comparar
    const lowerAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    const hasPermission = lowerAllowedRoles.includes(userRole);

    if (!hasPermission) {
      console.warn(`Acceso denegado para el rol: ${userRole}`);
      // Redirigir según el rol que sí tiene
      return <Navigate to={userRole === 'cliente' ? "/homeC" : "/home"} replace />;
    }
  }

  // 5. Si todo está bien, renderizar la ruta hija
  return <Outlet />;
};

export default ProtectedRoute;