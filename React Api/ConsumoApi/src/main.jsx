import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Listar_Cls_Tipo_Catalogo from './Listar_Cls_Tipo_Catalogo.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Listar_Cls_Tipo_Catalogo/>
  </StrictMode>,
)
