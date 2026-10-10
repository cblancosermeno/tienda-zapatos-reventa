import { useEffect, useState } from "react";
import Filtros from "../components/Filtros.jsx";
import Catalogo from "../components/Catalogo.jsx";
import { obtenerMarcas, obtenerEstilos, obtenerColores, obtenerTallas, obtenerProductos } from "../api.js";

function PaginaCatalogo() {
  const [marcas, setMarcas] = useState([]);
  const [estilos, setEstilos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({ marca: "", genero: "", estilo: "", color: "", talla: "" });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Carga las marcas una sola vez, al montar
  useEffect(() => {
    obtenerMarcas()
      .then(setMarcas)
      .catch(() => setError(true));
  }, []);

  // Recarga los estilos disponibles cuando cambia marca o género,
  // y limpia el estilo elegido si ya no aplica.
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

  // Recarga los colores disponibles cuando cambia marca, género o estilo,
  // y limpia el color elegido si ya no aplica.
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

  // Recarga las tallas disponibles (con stock real) cuando cambia marca,
  // género, estilo o color, y limpia la talla elegida si ya no aplica.
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

  // Vuelve a pedir productos cada vez que cambia cualquier filtro
  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(false);

    obtenerProductos(filtros)
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
        <Catalogo productos={productos} cargando={cargando} error={error} filtros={filtros} />
      </div>
    </div>
  );
}

export default PaginaCatalogo;
