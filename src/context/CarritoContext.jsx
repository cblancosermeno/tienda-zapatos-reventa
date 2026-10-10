import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext(null);

function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem("carrito");
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  function agregarAlCarrito(item, cantidad = 1) {
    setItems((actual) => {
      const existente = actual.find((i) => i.varianteId === item.varianteId);
      if (existente) {
        const nuevaCantidad = Math.min(existente.cantidad + cantidad, item.stock);
        return actual.map((i) =>
          i.varianteId === item.varianteId ? { ...i, cantidad: nuevaCantidad } : i
        );
      }
      return [...actual, { ...item, cantidad: Math.min(cantidad, item.stock) }];
    });
  }

  function actualizarCantidad(varianteId, cantidad) {
    setItems((actual) =>
      actual.map((i) =>
        i.varianteId === varianteId
          ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) }
          : i
      )
    );
  }

  function eliminarDelCarrito(varianteId) {
    setItems((actual) => actual.filter((i) => i.varianteId !== varianteId));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ items, agregarAlCarrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, total, cantidadTotal }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

function useCarrito() {
  return useContext(CarritoContext);
}

export { CarritoProvider, useCarrito };
