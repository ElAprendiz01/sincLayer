//voy hacer varios comentarios en el codigo para ir explicando cada parte, para que quede podamos saber que hace cada cosita 

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importamos useNavigate
import "../styles/home.css";//importo los estilos como hay supcapetas entonces ../ para llegar si hubiera oyra fuera ../../

export default function Home() {
  const [userName, setUserName] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Nuevo estado para controlar el modal de cierre de sesión
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Hook de navegación
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName"); // aqui capturo el nombre del usuario del localstorage para darle la bienvenida 
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Función definitiva que ejecuta el cierre de sesión
  const confirmLogout = () => {
    localStorage.clear(); // Limpiamos la sesión
    setUserName(null);    // Limpiamos el estado
    setShowLogoutModal(false); // Cerramos el modal
    
    // Redirigimos al Login reemplazando el historial para que no pueda usar el botón "Atrás"
    navigate("/", { replace: true });
  };

  return (
    // aqui comienxa el html por asi decirlo 
    <div className="home-container">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </div>
          <h2>SyncLayer Library</h2>
        </div>

        <button className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? "✖" : "☰"}
        </button>

        <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <ul>
            {userName && (
              <li className="welcome-text">Hola, {userName} 👋</li> // esto es lo que les decia para darle el saludo 
            )}
            
             {/*nota para estos btn es importante que esten protegidos con el ProtectedRoute para que no puedan entrar sin iniciar sesión, 
             aunque intenten entrar con la url directa, el guardia los redirigira al login y que tambien esten
             declaro en el app con en router obiamente que es donde se le pone la segurida d
             y mandarlo allamr como se debe */}
            
            
            <li><Link to="/admin" className="nav-btn">Administracion</Link></li> 
            <li><Link to="/homeC" className="nav-btn">Cliente</Link></li> 
            <li><Link to="/prestamos" className="nav-btn">Mis préstamos</Link></li>
            
          <li>
              <button 
                onClick={() => setShowLogoutModal(true)} 
                className="nav-btn logout-btn"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* HERO / PRESENTACIÓN */}
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a la Biblioteca SyncLayer</h1>
          <p>
            Un espacio donde el conocimiento, la lectura y la cultura
            se encuentran. Explora cientos de libros, descubre autores increíbles
            y administra tus préstamos de forma sencilla, todo en un solo lugar.
          </p>
          <div className="hero-buttons">
            <Link to="/biblioteca">
              <button>Explorar biblioteca</button>
            </Link>
            {/* Solo mostramos este botón en el hero si hay sesión */}
            {userName && (
              <Link to="/prestamos">
                <button className="secondary-btn">Mis préstamos</button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* BUSCADOR */}
      <section className="search-section">
        <h2>Buscar libros por nombre</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por título, autor o categoría..."
          />
          <button>Buscar</button>
        </div>
      </section>

      {/* LIBROS DESTACADOS */}
      <section className="featured-books">
        <h2>Libros destacados</h2>
        <div className="books-grid">
          <div className="book-card">
            <img src="/azul.jpg" alt="Libro"/>
            <h3>Azul</h3>
            <p>Rubén Darío</p>
          </div>
          <div className="book-card">
            <img src="/Don_quijote.jpg" alt="Libro"/>
            <h3>Don Quijote</h3>
            <p>Miguel de Cervantes</p>
          </div>
          <div className="book-card">
            <img src="/1984.jpg" alt="Libro"/>
            <h3>1984</h3>
            <p>George Orwell</p>
          </div>
          <div className="book-card">
            <img src="/100_años.jpg" alt="Libro"/>
            <h3>Cien años de soledad</h3>
            <p>Gabriel García Márquez</p>
          </div>
          <div className="book-card">
            <img src="/El_principito.jpg" alt="Libro"/>
            <h3>El Principito</h3>
            <p>Antoine de Saint-Exupéry</p>
          </div>
        </div>
      </section>

      {/* AUTORES */}
      <section className="authors">
        <h2>Autores destacados</h2>
        <div className="authors-grid">
          <div className="author-card">
            <img src="/Dario.png" alt="Autor"/>
            <h3>Rubén Darío</h3>
          </div>
          <div className="author-card">
            <img src="/Miguel _de_Cervantes.jpg" alt="Autor"/>
            <h3>Miguel de Cervantes</h3>
          </div>
          <div className="author-card">
            <img src="/George_Orwel.jpg" alt="Autor"/>
            <h3>George Orwell</h3>
          </div>
          <div className="author-card">
            <img src="/gabrielMarquez.jpg" alt="Autor"/>
            <h3>Gabriel García Márquez</h3>
          </div>
        </div>
      </section>

     

      {/* SECCIÓN SOBRE LA BIBLIOTECA */}
      <section className="about">

        <h2>Sobre nuestra biblioteca</h2>

        <p>
          SyncLayer Library es una plataforma diseñada para la gestión
          moderna de bibliotecas, inspirada por el docente Lovo Nuestro objetivo es 
          facilitar el acceso al conocimiento mediante herramientas digitales que permiten
          explorar las listas, gestionar préstamos y descubrir nuevos
          autores.
        </p>

      </section>



      {/* SERVICIOS */}
      <section className="services">

        <h2>Nuestros servicios</h2>

        <div className="services-grid">

          <div className="service-card">
            <h3> Lista de libros</h3>
            <p>
              Explora nuestra colección organizada por categorías,
              autores y editoriales.
            </p>
          </div>

          <div className="service-card">
            <h3> Gestión de préstamos</h3>
            <p>
              Solicita libros
            </p>
          </div>
          


        </div>

     </section>

     



      {/* CONTACTO */}
      <section className="contact">

        <h2>Contacto</h2>

        <div className="contact-container">

          <form>

            <input type="text" placeholder="Nombre"/>

            <input type="email" placeholder="Correo"/>

            <textarea placeholder="Mensaje"></textarea>

            <button>Enviar mensaje</button>

          </form>

          <div className="contact-info">

            <p> Dirección: Biblioteca Central</p>
            <p> Teléfono:  +505 8966 5458</p>
            <p> Email: Adminitaracion@synclayer.com</p>

          </div>

        </div>

      </section>
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Estás seguro de cerrar sesión?</h3>
            <p>Tendrás que volver a ingresar tus credenciales para acceder a tus préstamos.</p>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                No, cancelar
              </button>
              <button className="btn-confirm" onClick={confirmLogout}>
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}



      {/* FOOTER */}
      <footer className="footer">

        <p> Sistema de gestión de bibliotecas
            Construida en La universidad de Managua UdeM.
           El más añto nivel
        </p>

      </footer>


    </div>
  )
}