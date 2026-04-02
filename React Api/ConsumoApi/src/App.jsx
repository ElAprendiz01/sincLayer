import { BrowserRouter, Routes, Route } from "react-router-dom" 
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Administracion from "./pages/PginaCentralAdmin_bibliotecarios/Homeadminitracion"
import ListarCatalogo from "./pages/catalogo/ListarCatalogo" 
import ListarEstados from "./pages/Estados/ListarEstados";
import ListarTipoCatalogo from "./pages/admin/ListarTipoCatalogo";
import ListarPersonas from './pages/DatosPersonales/ListarDatosPersonales';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<Administracion />} />
          <Route path="/catalogos" element={<ListarCatalogo />} />
          <Route path="/autores" element={<ListarCatalogo />} /> 
          <Route path="/datos-personales" element={<ListarPersonas />} />
          <Route path="/estado" element={<ListarEstados />} />
          <Route path="/Tipocatalogo" element={<ListarTipoCatalogo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;