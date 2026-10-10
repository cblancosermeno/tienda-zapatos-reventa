import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { obtenerProductoDetalle } from "../api.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import { tallaACm } from "../utils/tallas.js";
import { conRecargo } from "../utils/precios.js";

// Si la URL termina en una extensión de video, la mostramos con <video>
// en vez de <img>. No hace falta marcar nada al cargarla: alcanza con
// pegar la URL de Cloudinary del video igual que se pega la de una foto.
function esVideo(url) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url || "");
}

function PaginaProducto() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const [searchParams] = useSearchParams();
  const tallaDesdeUrl = searchParams.get("talla") || "";
  const colorDesdeUrl = searchParams.get("color") || "";

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [colorElegido, setColorElegido] = useState("");
  const [tallaElegida, setTallaElegida] = useState("");
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  useEffect(() => {
    setCargando(true);
    setError(false);
    obtenerProductoDetalle(id)
      .then((data) => {
        setProducto(data);

        const variantesConStockInicial = data.variantes.filter((v) => v.stock > 0);
        const coloresConFotoInicial = [...new Set(data.imagenes.map((img) => img.color).filter(Boolean))];
        const coloresConStockInicial = coloresConFotoInicial.filter((c) =>
          variantesConStockInicial.some((v) => v.color === c)
        );

        // Si venimos del catálogo con color ya elegido, lo respeta.
        // Si solo venimos con talla, elige el primer color que SÍ tenga esa
        // talla en stock. Si no hay ningún filtro previo, elige el primer
        // color que tenga stock (nunca uno agotado).
        if (colorDesdeUrl) {
          setColorElegido(colorDesdeUrl);
        } else if (tallaDesdeUrl) {
          const colorValido = coloresConStockInicial.find((c) =>
            variantesConStockInicial.some((v) => v.color === c && v.talla === tallaDesdeUrl)
          );
          setColorElegido(colorValido || "");
        } else if (coloresConStockInicial.length > 0) {
          setColorElegido(coloresConStockInicial[0]);
        }

        if (tallaDesdeUrl) {
          setTallaElegida(tallaDesdeUrl);
        }

        setCargando(false);
      })
      .catch(() => {
        setError(true);
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <p className="mensaje-estado">Cargando...</p>;
  if (error || !producto) return <p className="mensaje-estado error">No se pudo cargar este producto.</p>;

  const variantesConStock = producto.variantes.filter((v) => v.stock > 0);

  // Colores que aparecen en las fotos (para la galería)
  const coloresConFoto = [...new Set(producto.imagenes.map((img) => img.color).filter(Boolean))];

  // Solo colores con AL MENOS una unidad en stock (en cualquier talla) —
  // nunca se muestra un color totalmente agotado.
  const coloresConStock = coloresConFoto.filter((c) => variantesConStock.some((v) => v.color === c));

  // Si ya hay una talla elegida, se acota aún más a los colores que tienen
  // ESA talla específica en stock.
  const coloresDisponibles = tallaElegida
    ? coloresConStock.filter((c) => variantesConStock.some((v) => v.color === c && v.talla === tallaElegida))
    : coloresConStock;

  const imagenesFiltradas = colorElegido
    ? producto.imagenes.filter((img) => img.color === colorElegido)
    : producto.imagenes;
  const galeria = imagenesFiltradas.length > 0 ? imagenesFiltradas : producto.imagenes;

  // Tallas disponibles para el color elegido (o todas si no hay color elegido)
  const tallasDisponibles = variantesConStock.filter((v) => !colorElegido || v.color === colorElegido);

  function elegirColor(c) {
    setColorElegido(c);
    setImagenActiva(0);
    setCantidad(1);
    setAgregado(false);
    // Si la talla elegida no existe en este color, la limpia
    if (tallaElegida && !variantesConStock.some((v) => v.color === c && v.talla === tallaElegida)) {
      setTallaElegida("");
    }
  }

  function elegirTalla(t) {
    setTallaElegida(t);
    setCantidad(1);
    setAgregado(false);
    // Si el color elegido no tiene esta talla, la limpia para no confundir
    if (colorElegido && !variantesConStock.some((v) => v.talla === t && v.color === colorElegido)) {
      setColorElegido("");
    }
  }

  const varianteSeleccionada = variantesConStock.find(
    (v) => v.talla === tallaElegida && (!colorElegido || v.color === colorElegido)
  );

  // Precio a mostrar: si ya hay variante elegida, el suyo (con descuento si
  // aplica). Si no, un rango de precios finales si varían entre variantes
  // con stock, o el único precio si todas comparten el mismo.
  const preciosFinalesConStock = [...new Set(variantesConStock.map((v) => Number(v.precio_final ?? v.precio)))];
  let textoPrecio;
  if (varianteSeleccionada) {
    textoPrecio = `$${conRecargo(varianteSeleccionada.precio_final ?? varianteSeleccionada.precio)}`;
  } else if (preciosFinalesConStock.length > 1) {
    const min = Math.min(...preciosFinalesConStock);
    const max = Math.max(...preciosFinalesConStock);
    textoPrecio = `$${conRecargo(min)} - $${conRecargo(max)}`;
  } else if (preciosFinalesConStock.length === 1) {
    textoPrecio = `$${conRecargo(preciosFinalesConStock[0])}`;
  } else {
    textoPrecio = producto.precio_referencia != null ? `$${conRecargo(producto.precio_referencia)}` : "Consultar";
  }

  const varianteEnOferta = varianteSeleccionada?.en_oferta && varianteSeleccionada.descuento_porcentaje > 0;

  // Género de cada color (toma el de la primera variante con stock de ese color)
  function generoDeColor(c) {
    const variante = variantesConStock.find((v) => v.color === c);
    return variante ? variante.genero : producto.genero;
  }

  function manejarAgregarAlCarrito() {
    if (!varianteSeleccionada) return;
    agregarAlCarrito(
      {
        varianteId: varianteSeleccionada.id,
        productoId: producto.id,
        nombre: producto.nombre,
        marca: producto.marca,
        talla: varianteSeleccionada.talla,
        color: varianteSeleccionada.color,
        precio: Number(conRecargo(varianteSeleccionada.precio_final ?? varianteSeleccionada.precio)),
        imagenUrl: galeria[0]?.url || producto.imagenes[0]?.url,
        stock: varianteSeleccionada.stock,
      },
      cantidad
    );
    setAgregado(true);
  }

  return (
    <div className="pagina-producto">
      <Link to="/tienda" className="volver-catalogo">
        ← Volver al catálogo
      </Link>

      <div className="detalle-producto">
        <div className="galeria">
          <div className="imagen-grande">
            {galeria[imagenActiva] ? (
              esVideo(galeria[imagenActiva].url) ? (
                <video
                  src={galeria[imagenActiva].url}
                  controls
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <img
                  src={galeria[imagenActiva].url}
                  alt={producto.nombre}
                  onClick={() => setLightboxAbierto(true)}
                  style={{ cursor: "zoom-in" }}
                />
              )
            ) : (
              <span>sin imagen</span>
            )}
          </div>
          {galeria.length > 1 && (
            <div className="miniaturas">
              {galeria.map((img, i) => (
                <button
                  key={img.id}
                  className={`miniatura ${i === imagenActiva ? "activa" : ""}`}
                  onClick={() => setImagenActiva(i)}
                >
                  {esVideo(img.url) ? (
                    <div className="miniatura-video">
                      <video src={img.url} muted preload="metadata" />
                      <span className="icono-play">▶</span>
                    </div>
                  ) : (
                    <img src={img.url} alt="" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {lightboxAbierto && galeria[imagenActiva] && !esVideo(galeria[imagenActiva].url) && (
          <div className="lightbox-fondo" onClick={() => setLightboxAbierto(false)}>
            <button
              className="lightbox-cerrar"
              onClick={() => setLightboxAbierto(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
            {galeria.length > 1 && (
              <button
                className="lightbox-flecha lightbox-flecha-izq"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagenActiva((i) => (i - 1 + galeria.length) % galeria.length);
                }}
                aria-label="Anterior"
              >
                ‹
              </button>
            )}
            <img
              src={galeria[imagenActiva].url}
              alt={producto.nombre}
              className="lightbox-imagen"
              onClick={(e) => e.stopPropagation()}
            />
            {galeria.length > 1 && (
              <button
                className="lightbox-flecha lightbox-flecha-der"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagenActiva((i) => (i + 1) % galeria.length);
                }}
                aria-label="Siguiente"
              >
                ›
              </button>
            )}
          </div>
        )}

        <div className="info-detalle">
          <p className="marca-detalle">{producto.marca}</p>
          <h1>{producto.nombre}</h1>
          {varianteEnOferta ? (
            <p className="precio-detalle-oferta">
              <span className="precio-tachado-detalle">${conRecargo(varianteSeleccionada.precio)}</span>
              <span className="precio-detalle">{textoPrecio}</span>
              <span className="etiqueta-descuento-detalle">-{varianteSeleccionada.descuento_porcentaje}%</span>
            </p>
          ) : (
            <p className="precio-detalle">{textoPrecio}</p>
          )}
          {producto.descripcion && <p className="descripcion-detalle">{producto.descripcion}</p>}

          {coloresConFoto.length > 0 && (
            <div className="selector-grupo">
              <p className="selector-etiqueta">Color</p>
              {coloresDisponibles.length === 0 ? (
                <p className="sin-stock">Sin stock en talla {tallaElegida} US en ningún color.</p>
              ) : (
                <div className="opciones">
                  {coloresDisponibles.map((c) => (
                    <div key={c} className="opcion-con-genero">
                      <span className="genero-de-color">{generoDeColor(c)}</span>
                      <button
                        className={`opcion ${colorElegido === c ? "seleccionada" : ""}`}
                        onClick={() => elegirColor(c)}
                      >
                        {c}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="selector-grupo">
            <p className="selector-etiqueta">Talla</p>
            {tallasDisponibles.length === 0 ? (
              <p className="sin-stock">Sin stock disponible{colorElegido ? ` en ${colorElegido}` : ""}.</p>
            ) : (
              <div className="opciones">
                {tallasDisponibles.map((v) => (
                  <button
                    key={v.id}
                    className={`opcion ${tallaElegida === v.talla ? "seleccionada" : ""}`}
                    onClick={() => elegirTalla(v.talla)}
                  >
                    {v.talla} US <span className="talla-cm">({tallaACm(v.talla, v.genero)} cm)</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {varianteSeleccionada && (
            <div className="selector-grupo">
              <p className="selector-etiqueta">Cantidad</p>
              <div className="selector-cantidad">
                <button
                  className="boton-cantidad"
                  onClick={() => {
                    setCantidad((c) => Math.max(1, c - 1));
                    setAgregado(false);
                  }}
                  disabled={cantidad <= 1}
                >
                  −
                </button>
                <span>{cantidad}</span>
                <button
                  className="boton-cantidad"
                  onClick={() => {
                    setCantidad((c) => Math.min(varianteSeleccionada.stock, c + 1));
                    setAgregado(false);
                  }}
                  disabled={cantidad >= varianteSeleccionada.stock}
                >
                  +
                </button>
                <span className="stock-nota">({varianteSeleccionada.stock} disponibles)</span>
              </div>
            </div>
          )}

          <button
            className="boton-agregar-carrito"
            disabled={!varianteSeleccionada}
            onClick={manejarAgregarAlCarrito}
          >
            {!varianteSeleccionada
              ? "Elige color y talla"
              : agregado
              ? "✓ Agregado — seguir viendo"
              : "Agregar al carrito"}
          </button>

          {agregado && (
            <button className="enlace-ver-carrito" onClick={() => navegar("/carrito")}>
              Ver carrito →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaginaProducto;
