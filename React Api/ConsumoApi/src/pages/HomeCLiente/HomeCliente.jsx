import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { 
  Activity, Book, Users, MapPin, ShieldCheck, 
  ClipboardList, BookOpen, AlertCircle, 
  Undo2, Handshake, DollarSign, Layers, Tag, ChevronRight, UserCircle,
  ArrowLeft 
} from 'lucide-react';

// --- ESTO ES LO QUE FALTABA (Variables de animación) ---
const containerVars = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { staggerChildren: 0.05 } 
  }
};

const itemVars = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};
// -------------------------------------------------------

const AdminDashboard = () => {
  const navigate = useNavigate();

  const categories = [
    {
      label: "Sistema y Catálogo",
      items: [
        { title: "Estado", icon: <Activity />, color: "from-blue-500 to-blue-600", path: "/estado", size: "large" },
        { title: "Catálogo", icon: <Book />, color: "from-indigo-500 to-indigo-600", path: "/catalogos" },
        { title: "Tipos", icon: <Layers />, color: "from-purple-500 to-purple-600", path: "/Tipocatalogo" },
      ]
    },
    {
      label: "Gestión de Usuarios",
      items: [
        { title: "Usuarios", icon: <UserCircle />, color: "from-teal-500 to-teal-600", path: "/usuarios" },
        { title: "Datos Personales", icon: <Users />, color: "from-emerald-500 to-emerald-600", path: "/datos-personales" },
        { title: "Roles", icon: <ShieldCheck />, color: "from-violet-500 to-violet-600", path: "/roles" },
        { title: "Direcciones", icon: <MapPin />, color: "from-cyan-500 to-cyan-600", path: "/direcciones" },
        { title: "Contactos", icon: <Tag />, color: "from-sky-500 to-sky-600", path: "/contactos" },
      ]
    },
    {
      label: "Biblioteca",
      items: [
        { title: "Libros", icon: <BookOpen />, color: "from-rose-500 to-rose-600", path: "//libros-consulta", size: "large" },
        { title: "Autores", icon: <Users />, color: "from-pink-500 to-pink-600", path: "/ActoresCliente" },
        { title: "Préstamos", icon: <ClipboardList />, color: "from-orange-500 to-orange-600", path: "/prestamosCliente" },
        { title: "Devoluciones", icon: <Undo2 />, color: "from-amber-500 to-amber-600", path: "/devoluciones" },
      ]
    },
    {
      label: "Finanzas",
      items: [
        { title: "Pagos", icon: <DollarSign />, color: "from-green-500 to-green-600", path: "/pagos" },
        { title: "Multas", icon: <AlertCircle />, color: "from-red-500 to-red-600", path: "/multa" },
        { title: "Acuerdos", icon: <Handshake />, color: "from-lime-500 to-lime-600", path: "/acuerdos" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 lg:p-12 font-sans text-white">
      
      {/* Botón Volver */}
      <motion.button
        whileHover={{ x: -5 }}
        onClick={() => navigate('/home')} 
        className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-6 bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-semibold tracking-wide">Volver al Inicio</span>
      </motion.button>

      <header className="mb-12 flex justify-between items-end">
        <div>
          <span className="text-blue-400 font-bold tracking-widest uppercase text-xs">Administración Central</span>
          <h1 className="text-4xl font-extrabold text-white mt-1">Panel de Control</h1>
        </div>
      </header>

      {/* Uso de containerVars aquí */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="space-y-10"
      >
        {categories.map((cat, idx) => (
          <section key={idx}>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 ml-1">
              {cat.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.items.map((item, i) => (
                <motion.button
                  key={i}
                  variants={itemVars} // Uso de itemVars aquí
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(30, 41, 59, 1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className={`
                    group relative flex flex-col items-start p-5 bg-slate-800/50 border border-slate-700 
                    rounded-3xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl 
                    hover:shadow-blue-500/10 overflow-hidden
                    ${item.size === 'large' ? 'sm:col-span-2' : 'col-span-1'}
                  `}
                >
                  <div className={`p-3 rounded-2xl bg-linear-to-r ${item.color} text-white mb-4 shadow-lg`}>
                    {React.cloneElement(item.icon, { size: 24 })}
                  </div>

                  <div className="flex justify-between items-center w-full mt-auto relative z-10">
                    <div className="text-left flex flex-col">
                      <span className="block text-white font-bold text-lg leading-tight">
                        {item.title}
                      </span>
                      <span className="text-slate-400 text-xs font-medium mt-1">Gestionar módulo</span>
                    </div>
                    <ChevronRight className="text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;