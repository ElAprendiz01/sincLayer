import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { 
  Activity, Book, Users, MapPin, ShieldCheck, 
  ClipboardList, BookOpen, AlertCircle, 
  Undo2, Handshake, DollarSign, Layers, Tag, ChevronRight, UserCircle,
  ArrowLeft // Agregado para el botón de volver
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const categories = [
    {
      label: "Sistema y Catálogo",
      items: [
        { title: "Estado", icon: <Activity />, color: "from-blue-500 to-blue-600", path: "/estado", size: "large" },
        { title: "Catálogo", icon: <Book />, color: "from-indigo-500 to-indigo-600", path: "/catalogo" },
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
        { title: "Libros", icon: <BookOpen />, color: "from-rose-500 to-rose-600", path: "/libros", size: "large" },
        { title: "Autores", icon: <Users />, color: "from-pink-500 to-pink-600", path: "/autores" },
        { title: "Préstamos", icon: <ClipboardList />, color: "from-orange-500 to-orange-600", path: "/prestamos" },
        { title: "Devoluciones", icon: <Undo2 />, color: "from-amber-500 to-amber-600", path: "/devoluciones" },
      ]
    },
    {
      label: "Finanzas",
      items: [
        { title: "Pagos", icon: <DollarSign />, color: "from-green-500 to-green-600", path: "/pagos" },
        { title: "Multas", icon: <AlertCircle />, color: "from-red-500 to-red-600", path: "/multas" },
        { title: "Acuerdos", icon: <Handshake />, color: "from-lime-500 to-lime-600", path: "/acuerdos" },
      ]
    }
  ];

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 lg:p-12 font-sans text-white">
      
      {/* --- BOTÓN DE VUELTA ATRÁS AGREGADO --- */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
        onClick={() => navigate('/home')} 
        className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-6 group bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold tracking-wide">Volver al Inicio</span>
      </motion.button>
      {/* --------------------------------------- */}

      <header className="mb-12 flex justify-between items-end">
        <div>
          <span className="text-blue-400 font-bold tracking-widest uppercase text-xs">Administración Central</span>
          <h1 className="text-4xl font-extrabold text-white mt-1">Panel de Control</h1>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-slate-400 text-sm font-medium">Bienvenido de nuevo,</p>
          <p className="text-white font-bold">Al Area de Control</p>
        </div>
      </header>

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
                  variants={itemVars}
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
                  {/* Icono con Gradiente */}
                  <div className={`p-3 rounded-2xl bg-linear- ${item.color} text-white mb-4 shadow-lg group-hover:rotate-6 transition-transform`}>
                    {React.cloneElement(item.icon, { size: 24 })}
                  </div>

                  <div className="flex justify-between items-center w-full mt-auto relative z-10">
                    <div className="text-left flex flex-col">
                      <span className="block text-white font-bold text-lg leading-tight">
                        {item.title}
                      </span>
                      <span className="text-slate-400 text-xs font-medium mt-1">Gestionar módulo</span>
                    </div>
                    <ChevronRight className="text-slate-500 group-hover:text-blue-400 transition-colors group-hover:translate-x-1" size={20} />
                  </div>

                  {/* Detalle decorativo de fondo */}
                  <div className={`absolute -right-4 -top-4 w-24 h-24 bg-linear- ${item.color} opacity-[0.05] rounded-full group-hover:opacity-[0.15] transition-opacity`}></div>
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