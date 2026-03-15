import { Link } from "react-router-dom"
import "../styles/home.css"
export default function Home() {

  return (

    <div className="home-container">

      {/* NAVBAR */}
      <header className="navbar">

        <div className="logo">
            <div className="logo-container">
              <img src="/logo.png" alt="Logo" className="logo-img" />
            </div>
             <h2>SyncLayer Library</h2>
        </div>

        <nav>
          <ul>
            <li><Link to="/home">Inicio</Link></li>
            <li><Link to="/biblioteca">Biblioteca</Link></li>
            <li><Link to="/prestamos">Préstamos</Link></li>
            <li><Link to="/autores">Autores</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </nav>

      </header>



      {/* HERO / PRESENTACIÓN */}
      <section className="hero">

        <div className="hero-content">

          <h1>Bienvenido a la Biblioteca SyncLayer</h1>

          <p>
            Un espacio  donde el conocimiento, la lectura y la cultura
            se encuentran. Explora cientos de libros, descubre autores increíbles
            y administra tus préstamos de forma sencilla, todo en un solo lugar.
          </p>

          <div className="hero-buttons">
            <Link to="/biblioteca">
              <button>Explorar biblioteca</button>
            </Link>
            
            <Link to="/prestamos">
              <button>Mis préstamos</button>
            </Link>
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
            <p>Ruben Dario</p>
          </div>

          <div className="book-card">
            <img src="Don_quijote.jpg" alt="Libro"/>
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
            <img src="/Dario.png"/>
            <h3>Ruben Dario </h3>
          </div>

          <div className="author-card">
            <img src="/Miguel _de_Cervantes.jpg"/>
            <h3>Miguel de Cervantes</h3>
          </div>

          <div className="author-card">
            <img src="/George_Orwel.jpg"/>
            <h3>George Orwell</h3>
          </div>

          <div className="author-card">
            <img src="/gabrielMarquez.jpg"/>
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
              Solicita libros, revisa fechas de devolución
              y consulta tu historial.
            </p>
          </div>

          <div className="service-card">
            <h3> Control de multas</h3>
            <p>
              Visualiza tus multas y administra pagos
              pendientes de forma sencilla.
            </p>
          </div>

          <div className="service-card">
            <h3> Perfil de usuario</h3>
            <p>
              Administra tus datos personales,
              contacto y dirección.
            </p>
          </div>

        </div>

      </section>



      {/* ESTADÍSTICAS */}
      <section className="stats">

        <div className="stat">
          <h3>3,000</h3>
          <p>Libros disponibles</p>
        </div>

        <div className="stat">
          <h3>500</h3>
          <p>Autores registrados</p>
        </div>

        <div className="stat">
          <h3>15</h3>
          <p>Usuarios activos</p>
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



      {/* FOOTER */}
      <footer className="footer">

        <p> Sistema de gestión de bibliotecas
            Inspirada por el Profesor Lovo.
            un verdadero sensei
        </p>

      </footer>


    </div>
  )
}
