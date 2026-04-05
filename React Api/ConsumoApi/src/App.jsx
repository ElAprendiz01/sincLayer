import { BrowserRouter, Routes, Route } from "react-router-dom" 
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Administracion from "./pages/PginaCentralAdmin_bibliotecarios/Homeadminitracion"
import ListarCatalogo from "./pages/catalogo/ListarCatalogo" 
import ListarEstados from "./pages/Estados/ListarEstados";
import ListarTipoCatalogo from "./pages/admin/ListarTipoCatalogo";
import ListarPersonas from './pages/DatosPersonales/ListarDatosPersonales';
import ListarContactos from './pages/contactos/ListarContactos'
import ListarDirecciones from './pages/Direcciones/ListarDirecciones'
import ListarLibros from './pages/Libros/ListarLibros'
import { ToastProvider } from './components/ToastContext';
import Prestamos from './pages/Prestamos/ListarPrestamos';
import Multas from './pages/Multas/GestionMultas';
import Devoluciones from './pages/Devoluciones/devoluciones';
import ListarAurres from './pages/Autores/ListarAutores';
import Cliente from './pages/HomeCLiente/HomeCliente';

function App() {
  return (
    // Colocamos el Provider AQUÍ para que envuelva a toda la app
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<Administracion />} />
            <Route path="/homeC" element={<Cliente />} />
            <Route path="/prestamosCliente" element={<Prestamos esCliente={true}  />} />
            <Route path="/libros-consulta" element={<ListarLibros soloLectura={true} />} />
            <Route path="/ActoresCliente" element={<ListarAurres soloLectura={true} />} />
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/catalogos" element={<ListarCatalogo />} />
            <Route path="/autores" element={<ListarAurres />} /> 
            <Route path="/Contactos" element={<ListarContactos />} /> 
            <Route path="/datos-personales" element={<ListarPersonas />} />
            <Route path="/estado" element={<ListarEstados />} />
            <Route path="/Tipocatalogo" element={<ListarTipoCatalogo />} />
            <Route path="/multa" element={<Multas />} />
            <Route path="/libros" element={<ListarLibros />} />
            <Route path="/devoluciones" element={<Devoluciones />} />
            <Route path="/estado" element={<ListarEstados />} />
            <Route path="/direcciones" element={<ListarDirecciones />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;