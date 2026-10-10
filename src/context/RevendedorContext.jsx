import { createContext, useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const REVENDEDOR_ID = import.meta.env.VITE_REVENDEDOR_ID;

// Valores de respaldo: se usan si este despliegue no tiene configurado
// VITE_REVENDEDOR_ID, o si por algún motivo no se pudo traer la
// configuración desde el backend (por ejemplo, antes de dar de alta al
// revendedor en el admin). Así el sitio nunca se rompe por esto.
const VALORES_RESPALDO = {
  nombre: "",
  whatsapp_numero: "50370615677",
  telefono_llamada: "+50363072545",
  recargo: 10,
};

const RevendedorContext = createContext(VALORES_RESPALDO);

function RevendedorProvider({ children }) {
  const [revendedor, setRevendedor] = useState(VALORES_RESPALDO);

  useEffect(() => {
    if (!REVENDEDOR_ID) return;

    fetch(`${API_URL}/revendedores/${REVENDEDOR_ID}`)
      .then((resp) => {
        if (!resp.ok) throw new Error("No se pudo cargar la configuración del revendedor");
        return resp.json();
      })
      .then((data) => setRevendedor(data))
      .catch(() => setRevendedor(VALORES_RESPALDO));
  }, []);

  return <RevendedorContext.Provider value={revendedor}>{children}</RevendedorContext.Provider>;
}

function useRevendedor() {
  return useContext(RevendedorContext);
}

export { RevendedorProvider, useRevendedor };
