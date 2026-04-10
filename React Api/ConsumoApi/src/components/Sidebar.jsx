import { useNavigate, Link } from "react-router-dom";
import { 
  User, Shield, Book, LayoutDashboard, LogOut, 
  FileText, Receipt, CreditCard, Users, MapPin, NotebookPen 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  
  // Obtenemos el rol y lo normalizamos a minúsculas para comparar sin errores
  const rawRole = localStorage.getItem("userRole") || "";
  const role = rawRole.toLowerCase(); 

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
      <div className="mb-10 px-4">
        <h2 className="text-indigo-500 font-black text-2xl tracking-tighter">NEXACORE</h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sistema de Auditoría</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {/* --- SECCIÓN COMÚN --- */}
        <Link to="/home" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all text-sm font-medium">
          <LayoutDashboard size={18} className="text-indigo-400" /> Dashboard
        </Link>

        {/* --- SECCIÓN ADMIN / BIBLIOTECARIO --- */}
        {(role === "admin" || role === "bibliotecario") && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Gestión</p>
            </div>
            
            {role === "admin" && (
              <Link to="/usuarios" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all text-sm">
                <Shield size={18} className="text-rose-400" /> Usuarios
              </Link>
            )}

            <Link to="/libros" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all text-sm">
              <Book size={18} className="text-emerald-400" /> Inventario Libros
            </Link>

            <Link to="/prestamos" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all text-sm">
              <NotebookPen size={18} className="text-amber-400" /> Préstamos
            </Link>

            <div className="pt-4 pb-2 px-3">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Finanzas</p>
            </div>

            <Link to="/multa" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all text-sm">
              <FileText size={18} className="text-orange-400" /> Gestión Multas
            </Link>

            <Link to="/pagos" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all text-sm">
              <Receipt size={18} className="text-indigo-400" /> Caja y Cobros
            </Link>
          </>
        )}

        {/* --- SECCIÓN CLIENTE --- */}
        {role === "cliente" && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Mi Cuenta</p>
            </div>
            <Link to="/prestamosCliente" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all text-sm">
              <CreditCard size={18} className="text-blue-400" /> Mis Préstamos
            </Link>
            <Link to="/libros-consulta" className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all text-sm">
              <Search size={18} className="text-indigo-400" /> Catálogo Público
            </Link>
          </>
        )}
      </nav>

      {/* --- BOTÓN LOGOUT --- */}
      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all font-bold text-sm border border-transparent hover:border-rose-500/20"
      >
        <LogOut size={18} /> Cerrar Sesión
      </button>
    </aside>
  );
}