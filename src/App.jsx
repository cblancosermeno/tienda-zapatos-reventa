import { Routes, Route, Link, useLocation } from "react-router-dom";
import PaginaInicio from "./pages/PaginaInicio.jsx";
import PaginaCatalogo from "./pages/PaginaCatalogo.jsx";
import PaginaOfertas from "./pages/PaginaOfertas.jsx";
import PaginaProducto from "./pages/PaginaProducto.jsx";
import PaginaCarrito from "./pages/PaginaCarrito.jsx";
import { IconoRayo, IconoCarrito } from "./components/Iconos.jsx";
import { useCarrito } from "./context/CarritoContext.jsx";
import logo from "./assets/logo-sneaker-white.jpg";

function App() {
  const { cantidadTotal } = useCarrito();
  const { pathname } = useLocation();
  const esInicio = pathname === "/";

  if (esInicio) {
    return (
      <Routes>
        <Route path="/" element={<PaginaInicio />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <header className="barra-nav">
        <div className="barra-nav-interior">
          <Link to="/tienda" className="marca-nav">
            <img src={logo} alt="Sneaker White" className="logo-nav" />
            <span>Sneaker White</span>
          </Link>

          <nav className="nav-derecha">
            <Link to="/ofertas" className="nav-item nav-ofertas">
              <IconoRayo />
              <span>Ofertas</span>
            </Link>
            <Link to="/carrito" className="nav-item">
              <IconoCarrito />
              <span>Carrito</span>
              {cantidadTotal > 0 && <span className="contador-carrito">{cantidadTotal}</span>}
            </Link>
          </nav>
        </div>
      </header>

      <div className="tienda">
        <Routes>
          <Route path="/tienda" element={<PaginaCatalogo />} />
          <Route path="/ofertas" element={<PaginaOfertas />} />
          <Route path="/productos/:id" element={<PaginaProducto />} />
          <Route path="/carrito" element={<PaginaCarrito />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
