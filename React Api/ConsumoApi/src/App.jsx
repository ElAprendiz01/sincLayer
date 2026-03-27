import { BrowserRouter, Routes, Route } from "react-router-dom"
/* importar el guardia para que no puedan entrar a las otras oaginas con la <url></url>*/ 
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Administracion from "./pages/PginaCentralAdmin_bibliotecarios/Homeadminitracion"
import Listar_Cls_Tipo_Catalogo from "./pages/Catalogo/Listar_Cls_Tipo_Catalogo"

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        {/* 2. Envuelves Home con el ProtectedRoute */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        {/* 3. Haces lo mismo con el catálogo, o cualquier otra página que queramos  proteger */}
        <Route path="/Tipocatalogo" element={ <ProtectedRoute>
              <Listar_Cls_Tipo_Catalogo />
            </ProtectedRoute>} />

            {/*  este proceso para todas las páginas funcioan para  proteger */}
       <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Administracion />
          </ProtectedRoute>
        } 
      />
      </Routes>
         
     

    </BrowserRouter>
  )
}

export default App
