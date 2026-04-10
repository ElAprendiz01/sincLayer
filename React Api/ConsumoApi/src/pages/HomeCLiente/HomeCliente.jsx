import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import { 
  Activity, Book, Users, MapPin, ShieldCheck, 
  ClipboardList, BookOpen, AlertCircle, 
  Undo2, Handshake, DollarSign, Layers, Tag, ChevronRight, UserCircle,
  ArrowLeft, Cpu
} from 'lucide-react';

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

const AdminDashboard = () => {
  const navigate = useNavigate();

  const categories = [
    {
      label: "Núcleo del Sistema",
      items: [
        { title: "Estados", icon: <Activity />, color: "from-blue-500 to-blue-600", path: "/estado", size: "large" },
        { title: "Catálogos", icon: <Book />, color: "from-indigo-500 to-indigo-600", path: "/catalogos" },
        { title: "Tipos de Catálogo", icon: <Layers />, color: "from-purple-500 to-purple-600", path: "/Tipocatalogo" },
      ]
    },
    {
      label: "Capital Humano",
      items: [
        { title: "Usuarios Acceso", icon: <UserCircle />, color: "from-teal-500 to-teal-600", path: "/usuarios" },
        { title: "Datos Personales", icon: <Users />, color: "from-emerald-500 to-emerald-600", path: "/datos-personales" },
        { title: "Roles y Permisos", icon: <ShieldCheck />, color: "from-violet-500 to-violet-600", path: "/roles" },
        { title: "Direcciones", icon: <MapPin />, color: "from-cyan-500 to-cyan-600", path: "/direcciones" },
        { title: "Contactos", icon: <Tag />, color: "from-sky-500 to-sky-600", path: "/contactos" },
      ]
    },
    {
      label: "Módulo de Biblioteca",
      items: [
        { title: "Acervo Bibliográfico", icon: <BookOpen />, color: "from-rose-500 to-rose-600", path: "/libros-consulta", size: "large" },
        { title: "Autores", icon: <Users />, color: "from-pink-500 to-pink-600", path: "/ActoresCliente" },
        { title: "Control de Préstamos", icon: <ClipboardList />, color: "from-orange-500 to-orange-600", path: "/prestamosCliente" },
        { title: "Gestión de Retornos", icon: <Undo2 />, color: "from-amber-500 to-amber-600", path: "/devoluciones" },
      ]
    },
    {
      label: "Operaciones Financieras",
      items: [
        { title: "Procesar Pagos", icon: <DollarSign />, color: "from-green-500 to-green-600", path: "/pagos" },
        { title: "Multas y Sanciones", icon: <AlertCircle />, color: "from-red-500 to-red-600", path: "/multa" },
        { title: "Acuerdos de Pago", icon: <Handshake />, color: "from-lime-500 to-lime-600", path: "/acuerdos" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 lg:p-12 font-sans text-white selection:bg-blue-500/30">
      
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/home')} 
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors bg-transparent border-none cursor-pointer group"
        >
          <ArrowLeft size={20} className="group-hover:stroke-blue-400" />
          <span className="text-sm font-bold tracking-widest uppercase">Escritorio Principal</span>
        </motion.button>
        
        <div className="flex items-center gap-3 bg-slate-800/40 px-4 py-2 rounded-full border border-slate-700">
          <Cpu size={16} className="text-blue-400 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">NexaCore Engine v3.0</span>
        </div>
      </div>

      <header className="max-w-7xl mx-auto mb-12">
        <div className="relative inline-block">
          <span className="text-blue-500 font-black tracking-[0.2em] uppercase text-[10px] mb-2 block">
            Sincronización de Base de Datos Estable
          </span>
          <h1 className="text-5xl font-black text-white tracking-tight">
            Panel <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500">Administrativo</span>
          </h1>
          <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full"></div>
        </div>
      </header>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-12"
      >
        {categories.map((cat, idx) => (
          <section key={idx} className="relative">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">
                {cat.label}
              </h2>
              {/* CAMBIO: h-[1px] a h-px */}
              <div className="h-px w-full bg-slate-800/50"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cat.items.map((item, i) => (
                <motion.button
                  key={i}
                  variants={itemVars}
                  whileHover={{ 
                    y: -5,
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    borderColor: "rgba(59, 130, 246, 0.5)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(item.path)}
                  className={`
                    group relative flex flex-col items-start p-6 bg-slate-900/40 border border-slate-800/60 
                    rounded-4xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,112,184,0.15)]
                    backdrop-blur-md overflow-hidden
                    ${item.size === 'large' ? 'sm:col-span-2' : 'col-span-1'}
                  `}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className={`p-3 rounded-2xl bg-linear-to-br ${item.color} text-white mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                    {React.cloneElement(item.icon, { size: 22, strokeWidth: 2.5 })}
                  </div>

                  <div className="flex justify-between items-end w-full mt-auto relative z-10">
                    <div className="text-left flex flex-col">
                      <span className="block text-slate-100 font-bold text-lg tracking-tight">
                        {item.title}
                      </span>
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-blue-400 transition-colors">
                        Acceder al Módulo
                      </span>
                    </div>
                    <div className="bg-slate-800 p-2 rounded-xl group-hover:bg-blue-600 transition-colors">
                      <ChevronRight className="text-slate-400 group-hover:text-white" size={16} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        ))}
      </motion.div>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-top border-slate-800/50 flex justify-between items-center text-slate-600 text-[10px] font-mono tracking-tighter uppercase">
        <span>&copy; 2026 NexaCore Management System</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Server Online</span>
          <span>Encrypted Session</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;