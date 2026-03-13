import { useState } from "react"
import "../styles/login.css"

export default function Login() {

  const [usuario, setUsuario] = useState("")
  const [contraseña, setContraseña] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      Usuario: usuario,
      Contrasena: contraseña // enviar contraseña en texto plano
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

      // ✅ Evaluar token en la respuesta
      if (!result.token) {
        alert("Usuario o contraseña incorrecta")
        return
      }

      localStorage.setItem("token", result.token)
      alert("Login correcto")

    } catch (error) {
      console.error("Error en el login:", error)
      alert("Error de conexión con el servidor")
    }
  }

  return (
    <div className="login-container">
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
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  )
}