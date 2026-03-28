import { BrowserRouter, Routes, Route } from "react-router-dom"
/* importar el guardia para que no puedan entrar a las otras oaginas con la <url></url>*/ 
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Administracion from "./pages/PginaCentralAdmin_bibliotecarios/Homeadminitracion"
import Listar_Cls_Tipo_Catalogo from "./pages/Catalogo/Listar_Cls_Tipo_Catalogo"
import ListarAutores from "./pages/Autores/ListarAutores" 

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

         <Route element={<ProtectedRoute />}>
         
          <Route path="/home" element={<Home />} />
          <Route path="/Tipocatalogo" element={<Listar_Cls_Tipo_Catalogo />} />
          <Route path="/admin" element={<Administracion />} />

          <Route path="/autores" element={<ListarAutores />} />
        </Route>
      </Routes>
     

    </BrowserRouter>
  )
}

export default App
