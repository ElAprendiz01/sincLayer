import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const [userName, setUserName] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const navigate = useNavigate();

  // Obtenemos el rol limpio
  const rawRole = localStorage.getItem("userRole");
  const userRole = rawRole ? rawRole.trim().toLowerCase() : "";

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </div>
          <h2>SyncLayer Library</h2>
        </div>

        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? "✖" : "☰"}
        </button>

        <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <ul>
            {userName && <li className="welcome-text">Hola, {userName} 👋</li>}

            {/* --- BLOQUE DE ADMINISTRACIÓN --- */}
            {/* Solo se muestra si es admin o bibliotecario */}
            {(userRole === "admin" || userRole === "bibliotecario") && (
              <li>
                <Link to="/admin" className="nav-btn admin-btn">
                  Panel Administrativo
                </Link>
              </li>
            )}

            {/* --- BLOQUE DE CLIENTE --- */}
            {/* Estos enlaces los ven TODOS, o puedes restringirlos solo a clientes */}
            <li>
              <Link to="/homeC" className="nav-btn">Catálogo de Libros</Link>
            </li>
            
            <li>
              <Link to="/prestamosCliente" className="nav-btn">Mis Préstamos</Link>
            </li>

            {/* --- BOTÓN DE SALIDA --- */}
            <li>
              <button onClick={() => setShowLogoutModal(true)} className="nav-btn logout-btn">
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* HERO SECCIÓN: Aquí también puedes personalizar el mensaje según el rol */}
      <section className="hero">
        <div className="hero-content">
           <h1>{userRole === 'admin' ? 'Panel de Gestión NexaCore' : 'Tu Biblioteca Digital'}</h1>
           <p>
             {userRole === 'admin' 
               ? 'Bienvenido al panel de control. Aquí puedes gestionar inventario, usuarios y auditorías.' 
               : 'Explora miles de títulos y gestiona tus préstamos activos desde tu panel personal.'}
           </p>
        </div>
      </section>

      {/* MODAL DE LOGOUT (Se mantiene igual) */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Cerrar sesión?</h3>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={confirmLogout}>Sí, salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}