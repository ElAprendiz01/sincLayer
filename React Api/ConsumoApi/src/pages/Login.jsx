import { useState } from "react"
import "../styles/login.css"

export default function Login() {

  const [usuario, setUsuario] = useState("")
  const [contraseña, setContraseña] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      usuario,
      contraseña
    }

    try {

      const response = await fetch("https://localhost:5001/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        alert("Usuario o contraseña incorrecta")
        return
      }

      localStorage.setItem("token", result.token)

      alert("Login correcto")

    } catch (error) {
      console.error(error)
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