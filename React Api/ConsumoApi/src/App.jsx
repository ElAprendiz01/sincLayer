import { BrowserRouter, Routes, Route } from "react-router-dom" 
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Administracion from "./pages/PginaCentralAdmin_bibliotecarios/Homeadminitracion"
import ListarAutores from "./pages/Autores/ListarAutores" 
import ListarEstados from "./pages/Estados/ListarEstados";
import ListarTipoCatalogo from "./pages/admin/ListarTipoCatalogo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<Administracion />} />
          <Route path="/autores" element={<ListarAutores />} />
          <Route path="/estado" element={<ListarEstados />} />
          <Route path="/Tipocatalogo" element={<ListarTipoCatalogo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App