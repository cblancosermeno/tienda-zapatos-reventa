import { tallaACm } from "../utils/tallas.js";

function Filtros({ marcas, estilos, colores, tallas, filtros, onCambiarFiltros }) {
  return (
    <aside className="filtros">
      <div className="grupo-filtro">
        <h2>Marca</h2>
        <select
          className="select-talla"
          value={filtros.marca}
          onChange={(e) => onCambiarFiltros({ ...filtros, marca: e.target.value })}
        >
          <option value="">Todas</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.nombre}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grupo-filtro">
        <h2>Género</h2>
        <select
          className="select-talla"
          value={filtros.genero}
          onChange={(e) => onCambiarFiltros({ ...filtros, genero: e.target.value })}
        >
          <option value="">Todos</option>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      <div className="grupo-filtro">
        <h2>Estilo</h2>
        <select
          className="select-talla"
          value={filtros.estilo}
          onChange={(e) => onCambiarFiltros({ ...filtros, estilo: e.target.value })}
        >
          <option value="">Todos</option>
          {estilos.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="grupo-filtro">
        <h2>Color</h2>
        <select
          className="select-talla"
          value={filtros.color}
          onChange={(e) => onCambiarFiltros({ ...filtros, color: e.target.value })}
        >
          <option value="">Todos</option>
          {colores.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grupo-filtro">
        <h2>Talla</h2>
        <select
          className="select-talla"
          value={filtros.talla}
          onChange={(e) => onCambiarFiltros({ ...filtros, talla: e.target.value })}
        >
          <option value="">Todas</option>
          {tallas.map((t) => (
            <option key={t} value={t}>
              {t} US{filtros.genero ? ` (${tallaACm(t, filtros.genero)} cm)` : ""}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

export default Filtros;
