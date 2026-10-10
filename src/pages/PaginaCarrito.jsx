import { useState } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useRevendedor } from "../context/RevendedorContext.jsx";

function construirMensajeWhatsapp(items, total, cliente) {
  const lineas = items.map(
    (i) =>
      `• ${i.marca} ${i.nombre} — ${i.color ? `${i.color}, ` : ""}Talla ${i.talla} US x${i.cantidad} — $${(
        i.precio * i.cantidad
      ).toFixed(2)}`
  );

  const partes = [
    "Hola, quiero hacer este pedido:",
    "",
    ...lineas,
    "",
    `Total: $${total.toFixed(2)}`,
  ];

  if (cliente.nombre || cliente.telefono || cliente.direccion) {
    partes.push("", "Mis datos:");
    if (cliente.nombre) partes.push(`Nombre: ${cliente.nombre}`);
    if (cliente.telefono) partes.push(`Teléfono: ${cliente.telefono}`);
    if (cliente.direccion) partes.push(`Dirección: ${cliente.direccion}`);
  }

  return partes.join("\n");
}

function PaginaCarrito() {
  const { items, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, total } = useCarrito();
  const { whatsapp_numero } = useRevendedor();

  const [cliente, setCliente] = useState({ nombre: "", telefono: "", direccion: "" });
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  function manejarConfirmarPedido(e) {
    e.preventDefault();

    const mensaje = construirMensajeWhatsapp(items, total, cliente);
    const href = `https://wa.me/${whatsapp_numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(href, "_blank", "noopener,noreferrer");

    setPedidoEnviado(true);
    vaciarCarrito();
  }

  if (pedidoEnviado) {
    return (
      <div className="pagina-carrito">
        <div className="confirmacion-pedido">
          <h1>¡Listo!</h1>
          <p>
            Abrimos WhatsApp con el detalle de tu pedido. Enviá el mensaje para que te confirmemos
            disponibilidad, forma de pago y entrega.
          </p>
          <Link to="/" className="opcion" style={{ display: "inline-block", textDecoration: "none" }}>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pagina-carrito">
        <p className="mensaje-estado">
          Tu carrito está vacío.{" "}
          <Link to="/" style={{ color: "var(--stamp)" }}>
            Ver el catálogo
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="pagina-carrito">
      <h1 className="titulo-carrito">Tu carrito</h1>

      <div className="cuerpo-carrito">
        <div className="lista-carrito">
          {items.map((i) => (
            <div className="item-carrito" key={i.varianteId}>
              <div className="imagen-item-carrito">
                {i.imagenUrl ? <img src={i.imagenUrl} alt={i.nombre} /> : "sin imagen"}
              </div>
              <div className="info-item-carrito">
                <p className="marca-item">{i.marca}</p>
                <p className="nombre-item">{i.nombre}</p>
                <p className="detalle-item">
                  {i.color && `${i.color} · `}Talla {i.talla} US
                </p>
                <div className="controles-item">
                  <div className="selector-cantidad chico">
                    <button
                      className="boton-cantidad"
                      onClick={() => actualizarCantidad(i.varianteId, i.cantidad - 1)}
                      disabled={i.cantidad <= 1}
                    >
                      −
                    </button>
                    <span>{i.cantidad}</span>
                    <button
                      className="boton-cantidad"
                      onClick={() => actualizarCantidad(i.varianteId, i.cantidad + 1)}
                      disabled={i.cantidad >= i.stock}
                    >
                      +
                    </button>
                  </div>
                  <button className="quitar-item" onClick={() => eliminarDelCarrito(i.varianteId)}>
                    Quitar
                  </button>
                </div>
              </div>
              <div className="subtotal-item">${(i.precio * i.cantidad).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="resumen-checkout">
          <div className="fila-total">
            <span>Total</span>
            <span className="monto-total">${total.toFixed(2)}</span>
          </div>

          <form onSubmit={manejarConfirmarPedido}>
            <h2>Tus datos (opcional)</h2>
            <p className="sin-stock" style={{ color: "inherit", opacity: 0.75 }}>
              Al confirmar se abre WhatsApp con tu pedido ya escrito, listo para enviar.
            </p>

            <div className="campo-checkout">
              <label>Nombre</label>
              <input
                value={cliente.nombre}
                onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
              />
            </div>
            <div className="campo-checkout">
              <label>Teléfono</label>
              <input
                type="tel"
                value={cliente.telefono}
                onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                placeholder="Para coordinar la entrega"
              />
            </div>
            <div className="campo-checkout">
              <label>Dirección de entrega</label>
              <textarea
                rows={2}
                value={cliente.direccion}
                onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
                placeholder="Dirección completa donde recibirás el pedido"
              />
            </div>

            <button className="boton-agregar-carrito">Confirmar pedido por WhatsApp</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaginaCarrito;
