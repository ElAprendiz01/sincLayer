export const HasPermission = ({ rolesPermitidos, children, renderDisabled = false }) => {
  const userRole = localStorage.getItem("userRole")?.toLowerCase();
  
  const tienePermiso = rolesPermitidos.includes(userRole);

  if (!tienePermiso) {
    // Si queremos que el botón aparezca pero bloqueado
    if (renderDisabled) {
      return React.cloneElement(children, { disabled: true, style: { opacity: 0.5, cursor: 'not-allowed' } });
    }
    // Si no tiene permiso, no devuelve nada (desaparece el botón)
    return null;
  }

  return children;
};