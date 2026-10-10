import ProductoCard from "./ProductoCard.jsx";

function Catalogo({ productos, cargando, error, filtros, mensajeVacio }) {
  if (cargando) {
    return <p className="mensaje-estado">Cargando el catálogo...</p>;
  }

  if (error) {
    return (
      <p className="mensaje-estado error">
        No se pudo conectar con el servidor. Verifica que el backend esté corriendo en{" "}
        {import.meta.env.VITE_API_URL || "http://localhost:4000/api"}.
      </p>
    );
  }

  if (productos.length === 0) {
    return <p className="mensaje-estado">{mensajeVacio || "Ningún par coincide con estos filtros."}</p>;
  }

  return (
    <>
      <p className="conteo">
        {productos.length} {productos.length === 1 ? "par encontrado" : "pares encontrados"}
      </p>
      <div className="grid-productos">
        {productos.map((p) => (
          <ProductoCard key={p.id} producto={p} filtros={filtros} />
        ))}
      </div>
    </>
  );
}

export default Catalogo;
