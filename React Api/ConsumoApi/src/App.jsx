import Login from "./pages/Login"
import Listar_Cls_Tipo_Catalogo from "./pages/Listar_Cls_Tipo_Catalogo"

function App() {

  const token = localStorage.getItem("token")

  if(!token){
    return <Login/>
  }

  return <Listar_Cls_Tipo_Catalogo/>

}

export default App