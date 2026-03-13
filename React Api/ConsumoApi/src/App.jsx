import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Listar_Cls_Tipo_Catalogo from "./pages/Catalogo/Listar_Cls_Tipo_Catalogo"


function App() {

  const token = localStorage.getItem("token")

  return (

    <BrowserRouter>

      {!token ? (

        <Login/>

      ) : (

        <Routes>

          <Route path="/Catalogo" element={<Listar_Cls_Tipo_Catalogo/>} />
          {/* <Route path="/catalogos" element={<Listar_Cls_Tipo_Catalogo/>} /> */}

          {/* <Route path="/estados" element={<ListarEstados/>} /> */}

        </Routes>

      )}

    </BrowserRouter>

  )
}

export default App