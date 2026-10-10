import { Link } from "react-router-dom";
import { conRecargo } from "../utils/precios.js";
import { useRevendedor } from "../context/RevendedorContext.jsx";

function ProductoCard({ producto, filtros }) {
  const { recargo } = useRevendedor();
  const params = new URLSearchParams();
  if (filtros?.talla) params.set("talla", filtros.talla);
  if (filtros?.color) params.set("color", filtros.color);
  const query = params.toString();

  const enOferta = producto.en_oferta && producto.descuento_porcentaje > 0;

  return (
    <Link to={`/productos/${producto.id}${query ? `?${query}` : ""}`} className="tarjeta">
      <div className="imagen-producto">
        {enOferta && (
          <span className="etiqueta-descuento">-{producto.descuento_porcentaje}%</span>
        )}
        {producto.imagen_principal ? (
          <img
            src={producto.imagen_principal}
            alt={producto.nombre}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          "sin imagen"
        )}
      </div>
      <div className="info-producto">
        <p className="marca">{producto.marca}</p>
        <p className="nombre">{producto.nombre}</p>
        <div className="fila-inferior">
          {enOferta ? (
            <span className="precio-con-oferta">
              <span className="precio-tachado">${conRecargo(producto.precio, recargo)}</span>
              <span className="precio-oferta">
                {producto.precio_varia
                  ? `Desde $${conRecargo(producto.precio_final, recargo)}`
                  : `$${conRecargo(producto.precio_final, recargo)}`}
              </span>
            </span>
          ) : (
            <span className="precio">
              {producto.precio_varia
                ? `Desde $${conRecargo(producto.precio, recargo)}`
                : `$${conRecargo(producto.precio, recargo)}`}
            </span>
          )}
          <span className="genero">{producto.genero}</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductoCard;
