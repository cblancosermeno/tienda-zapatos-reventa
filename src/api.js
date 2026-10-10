const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function obtenerMarcas() {
  const resp = await fetch(`${API_URL}/marcas`);
  if (!resp.ok) throw new Error("No se pudieron cargar las marcas");
  return resp.json();
}

async function obtenerEstilos(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.marca) params.set("marca", filtros.marca);
  if (filtros.genero) params.set("genero", filtros.genero);

  const resp = await fetch(`${API_URL}/estilos?${params.toString()}`);
  if (!resp.ok) throw new Error("No se pudieron cargar los estilos");
  return resp.json();
}

async function obtenerColores(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.marca) params.set("marca", filtros.marca);
  if (filtros.genero) params.set("genero", filtros.genero);
  if (filtros.estilo) params.set("estilo", filtros.estilo);

  const resp = await fetch(`${API_URL}/colores?${params.toString()}`);
  if (!resp.ok) throw new Error("No se pudieron cargar los colores");
  return resp.json();
}

async function obtenerTallas(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.marca) params.set("marca", filtros.marca);
  if (filtros.genero) params.set("genero", filtros.genero);
  if (filtros.estilo) params.set("estilo", filtros.estilo);
  if (filtros.color) params.set("color", filtros.color);

  const resp = await fetch(`${API_URL}/tallas?${params.toString()}`);
  if (!resp.ok) throw new Error("No se pudieron cargar las tallas");
  return resp.json();
}

async function obtenerProductos(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.marca) params.set("marca", filtros.marca);
  if (filtros.genero) params.set("genero", filtros.genero);
  if (filtros.estilo) params.set("estilo", filtros.estilo);
  if (filtros.talla) params.set("talla", filtros.talla);
  if (filtros.color) params.set("color", filtros.color);

  const resp = await fetch(`${API_URL}/productos?${params.toString()}`);
  if (!resp.ok) throw new Error("No se pudieron cargar los productos");
  return resp.json();
}

async function obtenerOfertas(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.marca) params.set("marca", filtros.marca);
  if (filtros.genero) params.set("genero", filtros.genero);
  if (filtros.estilo) params.set("estilo", filtros.estilo);
  if (filtros.talla) params.set("talla", filtros.talla);
  if (filtros.color) params.set("color", filtros.color);

  const resp = await fetch(`${API_URL}/ofertas?${params.toString()}`);
  if (!resp.ok) throw new Error("No se pudieron cargar las ofertas");
  return resp.json();
}

async function obtenerProductoDetalle(id) {
  const resp = await fetch(`${API_URL}/productos/${id}`);
  if (!resp.ok) throw new Error("No se pudo cargar el producto");
  return resp.json();
}

async function crearPedido(datos) {
  const resp = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data.error || "No se pudo crear el pedido");
  return data;
}

export {
  obtenerMarcas,
  obtenerEstilos,
  obtenerColores,
  obtenerTallas,
  obtenerProductos,
  obtenerOfertas,
  obtenerProductoDetalle,
  crearPedido,
};
