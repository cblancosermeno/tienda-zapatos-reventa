# Tienda de zapatos — frontend (catálogo)

Catálogo público construido con React + Vite, que consume la API del backend.

## Instalación

```bash
npm install
cp .env.example .env
```

Por defecto `.env` apunta a `http://localhost:4000/api` — cámbialo solo si tu backend corre en otro puerto.

## Correr en desarrollo

Con el backend ya corriendo (`npm run dev` en la carpeta del backend), en esta carpeta corre:

```bash
npm run dev
```

Se abre en `http://localhost:5173`.

## Qué incluye esta primera versión

- Filtros por género, marca y talla (llaman a `GET /api/productos` con esos parámetros)
- Grid de productos con marca, nombre, precio y género
- Estados de carga, error de conexión, y "sin resultados"
- Las marcas del filtro se cargan dinámicamente desde `GET /api/marcas` — si agregas una marca nueva desde el backend, aparece aquí sin tocar código

## Siguientes pasos sugeridos

- Página de detalle de producto (tallas disponibles, galería de imágenes)
- Carrito de compras y flujo de checkout conectado a `POST /api/pedidos`
- Paginación si el catálogo crece mucho
