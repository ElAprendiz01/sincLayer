import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { 
  Activity, Book, Users, ShieldCheck, 
  ClipboardList, BookOpen, UserCircle, ArrowLeft, Tag 
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // 1. Normalización total del rol (Elimina espacios y convierte a minúsculas)
  const rawRole = localStorage.getItem("userRole");
  const userRole = rawRole ? rawRole.trim().toLowerCase() : "";

  // 2. ESCUDO DE SEGURIDAD: Si es cliente, lo sacamos antes de que vea nada
  useEffect(() => {
    if (userRole === "cliente") {
      navigate('/homeC');
    }
  }, [userRole, navigate]);

  // 3. Definición de categorías con lógica de visibilidad sincronizada
  const categories = useMemo(() => [
    {
      label: "Gestión Administrativa",
      visible: userRole === "admin", // Solo entra si es admin exacto
      items: [
        { title: "Usuarios", icon: <Users />, color: "from-teal-500 to-teal-600", path: "/usuarios" },
        { title: "Roles", icon: <ShieldCheck />, color: "from-violet-500 to-violet-600", path: "/roles" },
        { title: "Estado", icon: <Activity />, color: "from-blue-500 to-blue-600", path: "/estado" },
      ]
    },
    {
      label: "Operaciones de Biblioteca",
      visible: userRole === "admin" || userRole === "bibliotecario", 
      items: [
        { title: "Catálogo", icon: <Book />, color: "from-indigo-500 to-indigo-600", path: "/catalogos" },
        { title: "Libros", icon: <BookOpen />, color: "from-rose-500 to-rose-600", path: "/libros" },
        { title: "Préstamos", icon: <ClipboardList />, color: "from-orange-500 to-orange-600", path: "/prestamos" },
      ]
    },
    {
      label: "Mi Espacio Personal",
      visible: true, // Visible para todos
      items: [
        { title: "Mi Perfil", icon: <UserCircle />, color: "from-slate-500 to-slate-600", path: "/perfil" },
        { title: "Mis Préstamos", icon: <Tag />, color: "from-sky-500 to-sky-600", path: "/prestamosCliente" },
      ]
    }
  ], [userRole]);

  // Si es cliente, retornamos null para que no haya "parpadeo" de botones prohibidos
  if (userRole === "cliente") return null;

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 lg:p-12 text-white font-sans">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate('/home')} 
        className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-6 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={20} /> Volver al Inicio
      </button>

      {/* Header Dinámico */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest">
          Sesión actual: <span className="text-blue-400 font-bold">{userRole}</span>
        </p>
      </header>

      {/* Listado de Módulos Filtrados */}
      <div className="space-y-12">
        {categories
          .filter(cat => cat.visible) 
          .map((cat, idx) => (
            <section key={idx}>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 ml-1">
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cat.items.map((item, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ y: -5, backgroundColor: "rgba(30, 41, 59, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-start p-6 bg-slate-800/40 border border-slate-700 rounded-3xl text-left transition-all hover:border-blue-500/50"
                  >
                    <div className={`p-3 rounded-2xl bg-linear-to-r ${item.color} mb-4 shadow-lg`}>
                      {React.cloneElement(item.icon, { size: 24, color: "white" })}
                    </div>
                    <span className="text-white font-bold text-lg">{item.title}</span>
                    <span className="text-slate-500 text-xs mt-1">Gestionar módulo</span>
                  </motion.button>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
};

export default AdminDashboard;