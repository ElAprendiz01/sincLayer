import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Home from "./pages/Home"
import Listar_Cls_Tipo_Catalogo from "./pages/Catalogo/Listar_Cls_Tipo_Catalogo"

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/home" element={<Home />} />

        <Route path="/catalogo" element={<Listar_Cls_Tipo_Catalogo />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
