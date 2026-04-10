import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Plus, X, Save, ArrowLeft, AlertCircle, Edit, Trash2, User, BookOpen
} from "lucide-react";
import { 
  getLibros, 
  insertarLibro, 
  editarLibro, 
  eliminarLibro, 
  filtrarLibrosPorCategoria,
  filtrarLibrosPorAutor 
} from "./../../services/librosService";
import "../../styles/datospersonales.css";
import { useToast } from "../../components/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const ListarLibros = ({ soloLectura = false }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAutor, setBusquedaAutor] = useState(""); 
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState({ abierto: false, id: null });

  const userIdLogueado = parseInt(localStorage.getItem("userId") || "0");

  const estadoInicial = {
    id_Libro: null,
    titulo: "",
    isbn: "",
    id_Autor: "",
    id_Categoria: "",
    editorial: "",
    año_Publicacion: new Date().getFullYear(),
    stock: 0,
    id_Creador: userIdLogueado,
    id_Estado: 3, 
    forzarRecuperacion: false
  };

  const [formData, setFormData] = useState(estadoInicial);

  // Lógica de filtrado con Debounce
  useEffect(() => {
    const filtrar = async () => {
      if (busqueda.trim() === "" && busquedaAutor.trim() === "") {
        fetchLibros();
        return;
      }
      
      setCargando(true);
      try {
        let res;
        if (busquedaAutor.trim() !== "") {
          res = await filtrarLibrosPorAutor(busquedaAutor);
        } else {
          res = await filtrarLibrosPorCategoria(busqueda);
        }
        setLista(res.data || []);
      } catch (error) {
        setLista([]); 
      } finally {
        setCargando(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      filtrar();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [busqueda, busquedaAutor]);

  const fetchLibros = async () => {
    setCargando(true);
    try {
      const res = await getLibros();
      setLista(res.data || []);
    } catch (error) {
      showToast("Error al conectar con la base de datos", "error");
    } finally { setCargando(false); }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (formData.id_Libro) {
        await editarLibro(formData.id_Libro, { ...formData, id_Modificador: userIdLogueado });
        showToast("Registro actualizado en el sistema", "success");
      } else {
        await insertarLibro(formData);
        showToast("Libro indexado correctamente", "success");
      }
      setMostrarModal(false);
      fetchLibros();
    } catch (error) {
      const msj = error.response?.data?.msj || "Fallo en la transacción de datos";
      showToast(msj, "error");
    }
  };

  const ejecutarEliminacion = async () => {
    try {
      await eliminarLibro(confirmarBorrado.id, userIdLogueado);
      showToast("Registro marcado como inactivo", "warning");
      fetchLibros();
    } catch (error) { showToast("Error de integridad al eliminar", "error"); }
    finally { setConfirmarBorrado({ abierto: false, id: null }); }
  };

  const prepararEdicion = (l) => {
    setFormData({
      id_Libro: l.id_Libro,
      titulo: l.titulo,
      isbn: l.isbn,
      id_Autor: l.id_Autor,
      id_Categoria: l.id_Categoria,
      editorial: l.editorial,
      año_Publicacion: l.año_Publicacion,
      stock: l.stock,
      id_Estado: l.id_Estado || 3,
      forzarRecuperacion: false
    });
    setMostrarModal(true);
  };

  return (
    <div className="cat-page bg-[#0f172a] min-h-screen text-slate-100">
      <div className="cat-header border-b border-slate-800/60 pb-6 mb-8">
        <div className="header-left">
          <button className="btn-back hover:bg-slate-800" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Módulo de Biblioteca</span>
            <h1 className="text-2xl font-black">{soloLectura ? "Consulta de Acervo" : "Gestión de Catálogo"}</h1>
          </div>
        </div>

        <div className="search-group-container flex items-center gap-4 flex-1 mx-8">
          <div className="search-container bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 flex items-center flex-2">
            <Search className="text-slate-500 mr-2" size={18} />
            <input 
              className="bg-transparent border-none outline-none text-sm w-full" 
              placeholder="Filtrar por categoría..." 
              value={busqueda} 
              onChange={(e) => { setBusqueda(e.target.value); setBusquedaAutor(""); }} 
            />
          </div>
          
          <div className="search-container bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 flex items-center flex-1">
            <User className="text-slate-500 mr-2" size={18} />
            <input 
              className="bg-transparent border-none outline-none text-sm w-full" 
              type="number"
              placeholder="ID Autor..." 
              value={busquedaAutor} 
              onChange={(e) => { setBusquedaAutor(e.target.value); setBusqueda(""); }} 
            />
          </div>
        </div>

        {!soloLectura && (
          <button className="btn-main bg-linear-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/20" onClick={() => { setFormData(estadoInicial); setMostrarModal(true); }}>
            <Plus size={18} /> Nuevo Libro
          </button>
        )}
      </div>

      <div className="cat-grid max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cargando ? (
          <div className="col-span-full flex flex-col items-center py-20 opacity-50">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest">Sincronizando con NexaCore Database...</p>
          </div>
        ) : lista.length > 0 ? (
          lista.map((l) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={l.id_Libro} 
              className="cat-card bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">ISBN: {l.isbn}</span>
                    <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">{l.titulo}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${l.estado?.toLowerCase() === 'activo' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    {l.estado}
                </span>
              </div>

              <div className="bg-slate-950/50 rounded-2xl p-4 space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Referencia ID:</span>
                  <span className="font-mono text-blue-400">#{l.id_Libro}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Autor:</span>
                  <span className="text-slate-300 font-medium">{l.nombre_Autor || "Desconocido"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Disponibilidad:</span>
                  <span className={`font-bold ${l.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{l.stock} unidades</span>
                </div>
              </div>

              {!soloLectura && (
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-blue-600 rounded-xl text-xs font-bold transition-colors" onClick={() => prepararEdicion(l)}>
                    <Edit size={14} /> Editar
                  </button>
                  <button className="p-2 bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 rounded-xl transition-colors" onClick={() => setConfirmarBorrado({ abierto: true, id: l.id_Libro })}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <AlertCircle className="mx-auto mb-4 text-slate-700" size={60} />
            <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">Sin coincidencias en el sistema</h3>
            <button className="mt-4 text-blue-500 text-xs font-bold uppercase border-b border-blue-500/30 pb-1" onClick={() => {setBusqueda(""); setBusquedaAutor("");}}>Resetear Filtros</button>
          </div>
        )}
      </div>

      {/* AnimatePresence para el modal facilitaría las cosas, pero mantendremos tu estructura lógica */}
      {!soloLectura && mostrarModal && (
        <div className="modal-overlay backdrop-blur-sm bg-slate-950/80 flex items-center justify-center fixed inset-0 z-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="cat-form-card bg-slate-900 border border-slate-700 rounded-4xl p-8 max-w-xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <BookOpen size={20} />
                </div>
                <h3 className="text-xl font-black">{formData.id_Libro ? "Actualizar Registro" : "Indexar Nuevo Libro"}</h3>
              </div>
              <X className="cursor-pointer text-slate-500 hover:text-white" onClick={() => setMostrarModal(false)} />
            </div>

            <form onSubmit={handleGuardar} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Título Principal</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-colors" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID Autor</label>
                  <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none" value={formData.id_Autor} onChange={(e) => setFormData({...formData, id_Autor: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID Categoría</label>
                  <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none" value={formData.id_Categoria} onChange={(e) => setFormData({...formData, id_Categoria: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ISBN Code</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none" value={formData.isbn} onChange={(e) => setFormData({...formData, isbn: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stock</label>
                  <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 outline-none" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-800">
                <button type="button" className="flex-1 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-colors" onClick={() => setMostrarModal(false)}>Descartar</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                    <Save size={18} /> Confirmar Datos
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* El modal de confirmación de borrado también se beneficia de estilos más oscuros */}
      {!soloLectura && confirmarBorrado.abierto && (
        <div className="modal-overlay backdrop-blur-md bg-slate-950/90 fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-slate-900 border border-rose-500/30 p-8 rounded-4xl max-w-sm w-full text-center">
            <AlertCircle className="mx-auto mb-4 text-rose-500" size={50} />
            <h3 className="text-xl font-black mb-2">¿Confirmar Eliminación?</h3>
            <p className="text-slate-400 text-sm mb-8">Esta acción marcará el libro como inactivo en el sistema global.</p>
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 bg-slate-800 rounded-xl font-bold" onClick={() => setConfirmarBorrado({abierto:false, id: null})}>Abortar</button>
              <button className="py-3 bg-rose-600 rounded-xl font-bold shadow-lg shadow-rose-600/20" onClick={ejecutarEliminacion}>Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarLibros;