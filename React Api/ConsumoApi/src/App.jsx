import { BrowserRouter, Routes, Route } from "react-router-dom" 
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Administracion from "./pages/PginaCentralAdmin_bibliotecarios/Homeadminitracion"

// CORRECCIÓN AQUÍ: 
// Importamos el componente desde la carpeta Autores, 
// pero le damos el nombre ListarCatalogo para que coincida con el Route de abajo.
import ListarCatalogo from "./pages/catalogo/ListarCatalogo" 

import ListarEstados from "./pages/Estados/ListarEstados";
import ListarTipoCatalogo from "./pages/admin/ListarTipoCatalogo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<Administracion />} />
          
          {/* Ahora React ya sabe qué es ListarCatalogo porque lo importamos arriba */}
          <Route path="/catalogos" element={<ListarCatalogo />} />
          
          {/* Si necesitas otra página para Autores real, deberías crear otro archivo.
              Por ahora, si catalogos y autores son lo mismo, puedes dejar solo una. */}
          <Route path="/autores" element={<ListarCatalogo />} /> 
          
          <Route path="/estado" element={<ListarEstados />} />
          <Route path="/Tipocatalogo" element={<ListarTipoCatalogo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;