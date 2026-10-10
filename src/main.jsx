import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import { RevendedorProvider } from "./context/RevendedorContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <RevendedorProvider>
        <CarritoProvider>
          <App />
          <Analytics />
        </CarritoProvider>
      </RevendedorProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Registro del service worker para que la tienda se pueda instalar como app
// (PWA). Solo en producción y solo si el navegador lo soporta.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((err) => {
      console.error("No se pudo registrar el service worker:", err);
    });
  });
}
