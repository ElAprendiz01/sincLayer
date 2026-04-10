import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      Usuario: usuario,
      Contrasena: password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/Usuario/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!result.token) {
        alert("Usuario o contraseña incorrecta");
        return;
      }

      // 1. Guardar token
      localStorage.setItem("token", result.token);
      
      // 2. Guardar nombre (usando el campo 'usuario' del JSON)
      localStorage.setItem("userName", result.usuario);
      
      // 3. Guardar ID (usando el campo 'id_Usuario' del JSON)
      localStorage.setItem("userId", result.id_Usuario);
      
      // 4. GUARDAR EL ROL (Basado en tu JSON: "rol": "admin")
      // Esto es lo que soluciona el error 'undefined'
      localStorage.setItem("userRole", result.rol);

      console.log("Sesión iniciada correctamente como:", result.rol);

      // 5. Redirección inteligente según el rol
      const userRole = result.rol.toLowerCase();
      if (userRole === "admin" || userRole === "bibliotecario") {
        navigate("/admin");
      } else {
        navigate("/homeC");
      }

    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <h2 className="text-indigo-500 font-black text-2xl tracking-tighter">Biblioteca Sinlayer</h2>
          <p className="text-slate-500 text-xs">Ingresa tus credenciales</p>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="login-button">
          Entrar al Sistema
        </button>
      </form>
    </div>
  );
}