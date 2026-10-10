import { useEffect, useState } from "react";
import Filtros from "../components/Filtros.jsx";
import Catalogo from "../components/Catalogo.jsx";
import { obtenerMarcas, obtenerEstilos, obtenerColores, obtenerTallas, obtenerOfertas } from "../api.js";

function PaginaOfertas() {
  const [marcas, setMarcas] = useState([]);
  const [estilos, setEstilos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({ marca: "", genero: "", estilo: "", color: "", talla: "" });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    obtenerMarcas()
      .then(setMarcas)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    obtenerEstilos({ marca: filtros.marca, genero: filtros.genero })
      .then((lista) => {
        setEstilos(lista);
        if (filtros.estilo && !lista.includes(filtros.estilo)) {
          setFiltros((f) => ({ ...f, estilo: "" }));
        }
      })
      .catch(() => setError(true));
  }, [filtros.marca, filtros.genero]);

  useEffect(() => {
    obtenerColores({ marca: filtros.marca, genero: filtros.genero, estilo: filtros.estilo })
      .then((lista) => {
        setColores(lista);
        if (filtros.color && !lista.includes(filtros.color)) {
          setFiltros((f) => ({ ...f, color: "" }));
        }
      })
      .catch(() => setError(true));
  }, [filtros.marca, filtros.genero, filtros.estilo]);

  useEffect(() => {
    obtenerTallas({
      marca: filtros.marca,
      genero: filtros.genero,
      estilo: filtros.estilo,
      color: filtros.color,
    })
      .then((lista) => {
        setTallas(lista);
        if (filtros.talla && !lista.includes(filtros.talla)) {
          setFiltros((f) => ({ ...f, talla: "" }));
        }
      })
      .catch(() => setError(true));
  }, [filtros.marca, filtros.genero, filtros.estilo, filtros.color]);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(false);

    obtenerOfertas(filtros)
      .then((data) => {
        if (cancelado) return;
        setProductos(data);
        setCargando(false);
      })
      .catch(() => {
        if (cancelado) return;
        setError(true);
        setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [filtros]);

  return (
    <div className="cuerpo">
      <Filtros
        marcas={marcas}
        estilos={estilos}
        colores={colores}
        tallas={tallas}
        filtros={filtros}
        onCambiarFiltros={setFiltros}
      />
      <div className="catalogo">
        <div className="encabezado-ofertas">
          <h2>Ofertas</h2>
          <p>Pares seleccionados con descuento por tiempo limitado.</p>
        </div>
        <Catalogo
          productos={productos}
          cargando={cargando}
          error={error}
          filtros={filtros}
          mensajeVacio="Por ahora no hay ofertas activas con estos filtros. Volvé a revisar pronto."
        />
      </div>
    </div>
  );
}

export default PaginaOfertas;
