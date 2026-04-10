import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from './components/ToastContext';

// Páginas Base
import Login from "./pages/Login";
import Home from "./pages/Home";
import Administracion from "./pages/PginaCentralAdmin_bibliotecarios/Homeadminitracion";
import Cliente from './pages/HomeCLiente/HomeCliente';

// Módulos de Gestión
import ListarLibros from './pages/Libros/ListarLibros';
import Prestamos from './pages/Prestamos/ListarPrestamos';
import Devoluciones from './pages/Devoluciones/devoluciones';
import Multas from './pages/Multas/GestionMultas';
import AcuerdosModulo from './pages/AcuerdosPago/AcuerdosPago';
import PagosModulo from "./pages/Pagos/PagoModulo";

// Módulos de Configuración y Datos
import ListarCatalogo from "./pages/catalogo/ListarCatalogo"; 
import ListarEstados from "./pages/Estados/ListarEstados";
import ListarTipoCatalogo from "./pages/admin/ListarTipoCatalogo";
import ListarPersonas from './pages/DatosPersonales/ListarDatosPersonales';
import ListarContactos from './pages/contactos/ListarContactos';
import ListarDirecciones from './pages/Direcciones/ListarDirecciones';
import ListarAutores from './pages/Autores/ListarAutores'; 
import ListarUsuarios from './pages/usuarios/ListaUsuarios';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* RUTA PÚBLICA */}
          <Route path="/" element={<Login />} />

          {/* 1. RUTAS GENERALES (Cualquier usuario logueado) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/homeC" element={<Cliente />} />
            <Route path="/datos-personales" element={<ListarPersonas />} />
            <Route path="/contactos" element={<ListarContactos />} /> 
            <Route path="/direcciones" element={<ListarDirecciones />} />
            <Route path="/perfil" element={<ListarPersonas />} /> {/* Para el link del Dashboard */}
          </Route>

          {/* 2. RUTAS PARA ADMIN Y BIBLIOTECARIO (Minúsculas para consistencia) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'bibliotecario']} />}>
            <Route path="/admin" element={<Administracion />} />
            <Route path="/usuarios" element={<ListarUsuarios />} />
            <Route path="/libros" element={<ListarLibros />} />
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/devoluciones" element={<Devoluciones />} />
            <Route path="/multa" element={<Multas />} />
            <Route path="/acuerdos" element={<AcuerdosModulo />} />
            <Route path="/pagos" element={<PagosModulo />} />
            <Route path="/autores" element={<ListarAutores />} /> 
            <Route path="/catalogos" element={<ListarCatalogo />} />
            <Route path="/Tipocatalogo" element={<ListarTipoCatalogo />} />
            <Route path="/estado" element={<ListarEstados />} />
          </Route>

          {/* 3. RUTAS EXCLUSIVAS PARA CLIENTE */}
          <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
            <Route path="/prestamosCliente" element={<Prestamos esCliente={true} />} />
            <Route path="/libros-consulta" element={<ListarLibros soloLectura={true} />} />
            <Route path="/ActoresCliente" element={<ListarAutores soloLectura={true} />} />
          </Route>

          {/* REDIRECCIÓN 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;