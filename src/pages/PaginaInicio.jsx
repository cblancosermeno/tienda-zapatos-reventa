import { Link } from "react-router-dom";
import logo from "../assets/logo-sneaker-white.jpg";
import { useRevendedor } from "../context/RevendedorContext.jsx";

const WHATSAPP_MENSAJE = "Hola, quiero más información sobre sus zapatillas";

function PaginaInicio() {
  const { whatsapp_numero, telefono_llamada } = useRevendedor();
  const whatsappHref = `https://wa.me/${whatsapp_numero}?text=${encodeURIComponent(
    WHATSAPP_MENSAJE
  )}`;
  const llamadaHref = `tel:${telefono_llamada}`;

  return (
    <div className="inicio">
      <div className="inicio-contenido">
        <img src={logo} alt="Sneaker White" className="inicio-logo" />

        <h1 className="inicio-titulo">Sneaker White</h1>
        <p className="inicio-slogan">Originalmente a tu alcance</p>

        <p className="inicio-descripcion">
          En Sneaker White vendemos zapatillas 100% originales, de las marcas
          que ya conocés y en las que confiás — nada de réplicas ni
          imitaciones. Trabajamos para que tener el par que querés no
          signifique pagar de más: precios pensados para tu bolsillo,
          variedad de tallas y colores, y la garantía de que lo que ves es
          exactamente lo que te llega a casa.
        </p>

        <Link to="/tienda" className="inicio-cta">
          Ver catálogo
        </Link>

        <div className="inicio-redes">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inicio-red"
            aria-label="WhatsApp"
          >
            WhatsApp
          </a>
          <a href={llamadaHref} className="inicio-red" aria-label="Llamar">
            Llamar
          </a>
        </div>
      </div>
    </div>
  );
}

export default PaginaInicio;
