import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/login.css"

export default function Login() {

  const navigate = useNavigate()

  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      Usuario: usuario,
      Contrasena: password
    }

try {
      const response = await fetch("http://localhost:5082/api/Usuario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!result.token) {
        alert("Usuario o contraseña incorrecta")
        return
      }

      // 1. Guardar token
      localStorage.setItem("token", result.token)
      
    
      localStorage.setItem("userName", result.usuario || usuario) 

      
      localStorage.setItem("userId", result.id_Usuario) 

      // redirigir al HOME
      navigate("/home")

    } catch (error) {
      console.error("Error en el login:", error)
      alert("Error de conexión con el servidor")
    }
  }

  return (
    <div className="login-page">

      <form className="login-card" onSubmit={handleSubmit}>

        <h2>Iniciar sesión</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Entrar
        </button>

      </form>

    </div>
  )
}
